import { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
import { base } from 'viem/chains';
import { WagmiProvider } from 'wagmi'; 
import { wagmiConfig } from './wagmi'; 
 
 
const queryClient = new QueryClient(); 
 
function OnchainProviders({ children }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={import.meta.env.VITE_COINBASE_API_KEY}
          chain={base}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider> 
  );
}

OnchainProviders.propTypes = {
    children: ReactNode,
}
 
export default OnchainProviders;