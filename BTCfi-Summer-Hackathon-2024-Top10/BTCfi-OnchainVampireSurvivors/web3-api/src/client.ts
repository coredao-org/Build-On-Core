import { createThirdwebClient, defineChain, getContract } from "thirdweb";

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId = import.meta.env.VITE_TEMPLATE_CLIENT_ID;

export const thetaTestnet = defineChain({
  id: 1115,
  name: "Core Blockchain Testnet",
  rpc: "https://rpc.test.btcs.network",
  nativeCurrency: { name: "tCORE", symbol: "tCORE", decimals: 18 },
  blockExplorers: [
    {
      name: "Core Blockchain Testnet explorer",
      url: "https://scan.test.btcs.network/",
    },
  ],
  testnet: true,
});

export const client = createThirdwebClient({
  clientId: clientId,
});

export const GameContract = getContract({
  client,
  chain: thetaTestnet,
  address: "0xD50123067AA006bD7a5E8188c1Ce04cEaB83872f", // ZKGameClient contract
});

window.thirdwebClient = client;
