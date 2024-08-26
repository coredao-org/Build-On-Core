"use client";

import { site } from "@/constants";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import { ReactNode } from "react";

export const LOCALHOST_CHAIN_ID: number = 1115;

const projectId = process.env.NEXT_PUBLIC_W3PROJECT_ID as string;

if (!projectId) throw new Error("No project ID found");

const coreTestnet = {
  chainId: 1115,
  name: "Core Blockchain Testnet",
  currency: "tCORE",
  explorerUrl: "https://scan.test.btcs.network",
  rpcUrl: "https://rpc.test.btcs.network",
};

const ethSepolia = {
  chainId: 11155111,
  name: "Ethereum Sepolia",
  currency: "ETH",
  explorerUrl: "https://sepolia.etherscan.io/",
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL as string,
};

const metadata = {
  name: site.name,
  description: site.description,
  url: site.url,
  icons: [site.icon],
};

const ethersConfig = defaultConfig({
  metadata,
  defaultChainId: LOCALHOST_CHAIN_ID,
});

createWeb3Modal({
  ethersConfig,
  chains: [coreTestnet],
  projectId: projectId,
  enableOnramp: true,
  enableAnalytics: true,
  themeMode: "dark",
  themeVariables: {
    "--w3m-font-family": "'Noto Sans', sans-serif",
    "--w3m-font-size-master": "9px",
  },
});

export function WalletProvider({ children }: { children: ReactNode }) {
  return children;
}
