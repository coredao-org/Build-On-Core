"use client";

import GlobalContextProvider from "./global-provider";
import { WalletProvider } from "@/context/wallet-provider";

export default function GlobalSession({ children }: ILayout) {
  return (
    <WalletProvider>
      <GlobalContextProvider>{children}</GlobalContextProvider>
    </WalletProvider>
  );
}
