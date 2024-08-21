import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";

// create the client with your clientId, or secretKey if in a server environment
export const client = createThirdwebClient({ 
  clientId: "4f4d7aad88cd12953957137f0f7c0081"
 });

//  const customChain = defineChain(1115)

// connect to your contract
export const contract = getContract({ 
  client, 
  chain: defineChain(1115), 
  // address: "0x6AC0AC64D21ecE4CD8d139DD362172C3C50b2C96"
  address:  "0xf9a38EDE9fd7Cb22B5c89Db79c1ef093b1453Cf0"
});