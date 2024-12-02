import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthersExtension } from "@dynamic-labs/ethers-v5";
import { ZeroDevSmartWalletConnectors } from "@dynamic-labs/ethereum-aa";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnonAadhaarProvider } from "@anon-aadhaar/react";

const evmNetworks = [
  {
    blockExplorerUrls: ["https://scan.test.btcs.network"],
    chainId: 1115,
    chainName: "Core Blockchain Testnet",
    iconUrls: ["https://scan.test.btcs.network/images/icon.png"],
    name: "Tcore",
    nativeCurrency: {
      decimals: 18,
      name: "tCORE",
      symbol: "tCORE",
    },
    networkId: 1115,

    rpcUrls: ["https://rpc.test.btcs.network"],
  },
];

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <DynamicContextProvider
    settings={{
      environmentId: "ac7b69c8-2497-4f54-991e-673fd47e061c",
      walletConnectorExtensions: [EthersExtension],
      walletConnectors: [
        EthereumWalletConnectors,
        ZeroDevSmartWalletConnectors,
      ],
      overrides: { evmNetworks },
    }}
  >
    <QueryClientProvider client={queryClient}>
      <AnonAadhaarProvider
        _useTestAadhaar={true}
        // _artifactslinks={{
        //   zkey_url: "/circuit_final.zkey",
        //   vkey_url: "/vkey.json",
        //   wasm_url: "/aadhaar-verfier.wasm",
        // }}
      >
        <App />
      </AnonAadhaarProvider>
    </QueryClientProvider>
  </DynamicContextProvider>
);
