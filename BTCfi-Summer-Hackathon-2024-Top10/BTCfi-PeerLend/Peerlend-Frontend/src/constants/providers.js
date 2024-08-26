import { ethers } from "ethers";
const chainName = 'sepolia'
const chainId = 11155111;

// read only provider pointing to mumbai. It allows read only access to the mumbai blockchain
export const readOnlyProvider = new ethers.JsonRpcProvider(
    import.meta.env.VITE_INFURA_RPC
);

export const wssProvider = new ethers.WebSocketProvider(
    import.meta.env.VITE_WSS_RPC_URL 
);

// read/write provider, that allows you to read data and also sign transaction on whatever chain it's pointing to
export const getProvider = (provider) => new ethers.BrowserProvider(provider);

