import "./App.css";
import Navbar from "./components/Navbar";
import BaseToast from "./components/BaseToast";
import Home from "./pages/Home";
import LaunchToken from "./pages/LaunchToken";
import TokenProfile from "./pages/TokenProfile";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

//Web3 modal and wagmi Imports
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { WagmiProvider } from "wagmi";
import { coreDao } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { type Chain } from "viem";
import MyTokens from "./pages/MyTokens";

// import { config } from "../config";

// 2. Set up a React Query client.
const queryClient = new QueryClient();

const projectId = "72e3576a5459f1784e32223a4e33ea29";

const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};
const coreDaoTestnet = {
  id: 1115,
  name: "Core Dao Testnet",
  nativeCurrency: { name: "TCore", symbol: "tCore", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.test.btcs.network"] },
  },
  blockExplorers: {
    default: {
      name: "Core Testnet Scan",
      url: "https://scan.test.btcs.network",
    },
  },
  contracts: {
    ensRegistry: {
      address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    },
    ensUniversalResolver: {
      address: "0xE4Acdd618deED4e6d2f03b9bf62dc6118FC9A4da",
      blockCreated: 16773775,
    },
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 14353601,
    },
  },
} as const satisfies Chain;

const chains = [coreDao, coreDaoTestnet] as const;
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
});

const App = () => {
  return (
    <AnimatePresence>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/launch" element={<LaunchToken />} />
              <Route path="/token/:id" element={<TokenProfile />} />
              <Route path="/myTokens" element={<MyTokens />} />
            </Routes>
          </Router>
        </QueryClientProvider>
      </WagmiProvider>
      <BaseToast />
    </AnimatePresence>
  );
};

export default App;
