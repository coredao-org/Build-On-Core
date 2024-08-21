// import { CONSTANT_ADDRESSES } from "@/data/addresses-data";
import {  CommemeDataResponseDaoCore, } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";

const CONSTANT_ADDRESSES = {
  137:{
      factoryAddress: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
      routerAddress: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
      wrapAddress: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
      commemeFactory: "0x3c287EBA998789a4a8C88ec0b251bb08978bb980",
      scanner: "https://polygonscan.com",
      graphql: "https://api.studio.thegraph.com/query/85941/commeme/version/latest",
      tokenName: "MATIC",
      // chain:polygon,
    
  },
  1116:{
      factoryAddress: "0xB45e53277a7e0F1D35f2a77160e91e25507f1763",
      routerAddress: "0x9B3336186a38E1b6c21955d112dbb0343Ee061eE",
      wrapAddress: "0x191e94fa59739e188dce837f7f6978d84727ad01",
      commemeFactory: "0xb8F55945296407B8f9a7095F0c71b221a257b2F2",
      scanner:"https://scan.coredao.org",
      graphql: "https://commeme-1.onrender.com",
      tokenName: "CORE",
      // chain:coreDao,
   
  }
} as const;

const queryCoreDao = gql`
  {
    commemes(orderBy: "totalDonation", orderDirection: "desc") {
      items {
        id
        commemeAddress
        creator
        isActive
        timeToClose
        threshold
        totalSupply
        name
        symbol
        tokenAddress
        metadata
        poolAddress
        totalDonation
        blockNumber
        blockTimestamp
        transactionHash
      }
    }
  }
`;
export type SupportChainId = keyof typeof CONSTANT_ADDRESSES;

export const useQueryCommemesCoreDao = (chainId: SupportChainId) => {
  
  return useQuery({

    queryKey: ['commemes-coredao'],
    refetchInterval: 7000,

    async queryFn() {
        const result = await request<CommemeDataResponseDaoCore>(CONSTANT_ADDRESSES[chainId].graphql, queryCoreDao);
        const commemes = result.commemes.items;
        console.log(commemes);
  
        const enrichedCommemes = await Promise.all(
        commemes.map(async (commeme) => {
          try {
            const response = await fetch(commeme.metadata);
            const metadataJson = await response.json();
            return {
              ...commeme,
              image: metadataJson.image,
              description: metadataJson.description,
            };
          } catch (error) {
            console.error(
              `Failed to fetch metadata for commeme ${commeme.id}:`,
              error
            );
            return commeme; // return the commeme without the enriched data if fetching fails
          }
        }));
  
        return enrichedCommemes.sort((a, b) => {
            if (a.isActive === b.isActive) {
              return Number(b.totalDonation) - Number(a.totalDonation); // Sort by totalDonation if both are either true or false
            }
            return a.isActive ? -1 : 1; // Place active ones first
        });;
    },
  });
};
