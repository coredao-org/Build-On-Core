import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/config";
import { AnonAadhaarProvider } from "@anon-aadhaar/react";
const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AnonAadhaarProvider _useTestAadhaar={true}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </WagmiProvider>
    </AnonAadhaarProvider>

  );
}
