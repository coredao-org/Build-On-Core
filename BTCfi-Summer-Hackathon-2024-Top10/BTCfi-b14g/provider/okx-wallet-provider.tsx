'use client';

import { btcNetwork } from '@/constant/network';
import { Nullable } from '@/types';
import { Okx } from '@/types/okx-wallet';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from 'react-toastify';

type Props = {
  account: Okx.Account;
  address: string;
  connect: () => Promise<void>;
  provider: Okx.Provider;
  evmProvider: Nullable<BrowserProvider>;
  chainId: string;
  signer: Nullable<JsonRpcSigner>;
  disconnect: () => void;
};

const defaultValues: Props = {
  account: null,
  address: '',
  connect: async () => {},
  provider: null,
  evmProvider: null,
  chainId: '',
  signer: null,
  disconnect: () => {},
};

const OkxWalletContext = createContext(defaultValues);

export const OkxWalletProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [account, setAccount] = useState<Okx.Account>(null);
  const [address, setAddress] = useState('');
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [chainId, setChainId] = useState('');
  const provider = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return window?.okxwallet?.[btcNetwork] ?? null;
  }, []);
  const evmProvider = useMemo(() => {
    if (typeof window === 'undefined' || !window?.okxwallet) return null;
    return new BrowserProvider(window.okxwallet);
  }, []);

  const connect = useCallback(async () => {
    if (window.innerWidth < 768) {
      toast.error('This application is only supported web version!!!');
      return;
    }

    try {
      if (!provider) return;
      const account = await provider.connect();
      console.log('Account :', account);
      setAccount(account);

      const addresses = await window.okxwallet.request({
        method: 'eth_requestAccounts',
      });
      setAddress(addresses[0]);
    } catch (error) {
      console.log('🚀 ~ connect ~ error:', error);
    }
    try {
      if (!window.okxwallet) return;
      const chainId = await window.okxwallet.request({ method: 'eth_chainId' });
      setChainId(chainId);
      const signer = await evmProvider!.getSigner();
      setSigner(signer);
    } catch (error) {
      console.log('🚀 ~ connect ~ error:', error);
    }
  }, [provider, setAccount]);

  const disconnect = useCallback(() => {
    setAccount(null);
    setAddress('');
  }, []);

  const listenEvent = useCallback(() => {
    if (!provider) return;
    provider.on('accountChanged', setAccount);

    window.okxwallet.on('accountsChanged', async (addresses) => {
      if (addresses.length) {
        setAddress(addresses[0]);
        const signer = await evmProvider!.getSigner();
        setSigner(signer);
      }
    });
    window.okxwallet.on('chainChanged', setChainId);
  }, [provider, setAccount]);

  useEffect(listenEvent, [listenEvent]);

  const values = useMemo(
    () => ({
      address,
      account,
      connect,
      provider,
      evmProvider,
      chainId,
      signer,
      disconnect,
    }),
    [
      address,
      account,
      connect,
      provider,
      evmProvider,
      chainId,
      signer,
      disconnect,
    ],
  );

  return (
    <OkxWalletContext.Provider value={values}>
      {children}
    </OkxWalletContext.Provider>
  );
};

export const useOkxWalletContext = () => {
  return useContext(OkxWalletContext);
};
