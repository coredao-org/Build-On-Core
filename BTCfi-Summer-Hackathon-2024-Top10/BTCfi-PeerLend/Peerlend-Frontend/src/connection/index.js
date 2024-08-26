import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";

export const SUPPORTED_CHAIN = 1115;

// const sepolia = {
//   chainId: 11155420,
//   name: 'Sepolia',
//   currency: 'ETH',
//   explorerUrl: 'https://etherscan.io',
//   rpcUrl: import.meta.env.VITE_INFURA_RPC
// }
const coretestnet = {
  chainId: 1115,
  name: "CORE Blockchain",
  currency: "TCORE",
  explorerUrl: "https://scan.test.btcs.network",
  rpcUrl: import.meta.env.VITE_INFURA_RPC,
};


const metadata = {
  name: "My Website",
  description: "My Website description",
  url: "https://localhost:5173",
  icons: ["https://localhost:5173"],
};

export const configWeb3Modal = () =>
  createWeb3Modal({
    ethersConfig: defaultConfig({ metadata }),
    chains: [coretestnet],
    projectId: import.meta.env.VITE_PROJECT_ID,
    enableEIP6963: true, // true by default
    enableInjected: true, // true by default
    enableCoinbase: true, // true by default
    rpcUrl: import.meta.env.VITE_COINBASE_RPC, // used for the Coinbase SDK
    defaultChainId: 1115, // used for the Coinbase SDK
    enableAnalytics: false,
    themeVariables: {
      "--w3m-accent": "#E0BB83",
      "--wcm-accent-fill-color": "#2a2a2a",
      "--w3m-border-radius-master": "10",
    },
  });
