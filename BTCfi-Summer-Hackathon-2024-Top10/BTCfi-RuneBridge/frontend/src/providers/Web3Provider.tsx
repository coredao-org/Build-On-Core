import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface Web3ContextType {
    provider: ethers.BrowserProvider | null;
    address: string | null;
    signer: ethers.JsonRpcSigner | null;
    chain: string | null;
    connect: () => Promise<void>;
    disconnect: () => void;
    switchToCoreChain: () => Promise<void>;
    addToken: (tokenAddress: string, tokenSymbol: string, tokenDecimals: number) => Promise<void>;
    initiateTransaction: (txObject: any, callback: (txReceipt: any) => void) => Promise<void>;
}

const defaultWeb3Context: Web3ContextType = {
    provider: null,
    address: null,
    signer: null,
    chain: null,
    connect: async () => {},
    disconnect: () => {},
    switchToCoreChain: async () => {},
    addToken: async () => {},
    initiateTransaction: async () => {},
};

const Web3Context = createContext(defaultWeb3Context);

export const useWeb3 = () => {
    return useContext(Web3Context);
};

export const Web3Provider = ({ children }: any) => {
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
    const [chain, setChain] = useState<string | null>('');

    useEffect(() => {
        if (window.ethereum) {
            const ethersProvider = new ethers.BrowserProvider(window.ethereum);

            ethersProvider.getNetwork().then((network) => {
                setChain(network.chainId.toString());
            });

            window.ethereum.on('chainChanged', (chainId: string) => {
                setChain(parseInt(chainId, 16).toString());
            });

            setProvider(ethersProvider);
        }
    }, []);

    const connect = async () => {
        if (!provider) {
            console.error('No provider found');
            return;
        }
        try {
            await provider.send('eth_requestAccounts', []);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            setSigner(signer);
            setAddress(address);
            await switchToCoreChain();
        } catch (error) {
            console.error('Connection error', error);
        }
    };

    const disconnect = () => {
        setSigner(null);
        setAddress(null);
    };

    const switchToCoreChain = async () => {
        const chainId = '0x45c'; 
        try {
            await provider?.send('wallet_switchEthereumChain', [{ chainId }]);
        } catch (switchError: any) {
            if (switchError.code === 4902) {
                await provider?.send('wallet_addEthereumChain', [
                    {
                        chainId,
                        chainName: 'Core Blockchain',
                        rpcUrls: ['https://rpc.ankr.com/core'],
                        nativeCurrency: {
                            name: 'CORE',
                            symbol: 'CORE',
                            decimals: 18,
                        },
                    },
                ]);
            } else {
                console.error('Switch error', switchError);
            }
        }
    };

    const addToken = async (tokenAddress: string, tokenSymbol: string, tokenDecimals: number) => {
        try {
            await provider?.send('wallet_watchAsset', {
                type: 'ERC20',
                options: {
                    address: tokenAddress,
                    symbol: tokenSymbol,
                    decimals: tokenDecimals,
                },
            });
        } catch (error) {
            console.error('Add token error', error);
        }
    };

    const initiateTransaction = async (txObject: any, callback: (txReceipt: any) => void) => {
        if (!signer) {
            console.error('No signer found');
            return;
        }
        try {
            const tx = await signer.sendTransaction(txObject);
            await tx.wait();
            callback(tx);
        } catch (error) {
            console.error('Transaction error', error);
        }
    };

    return (
        <Web3Context.Provider
            value={{
                provider,
                address,
                chain,
                signer,
                connect,
                disconnect,
                switchToCoreChain,
                addToken,
                initiateTransaction,
            }}
        >
            {children}
        </Web3Context.Provider>
    );
};
