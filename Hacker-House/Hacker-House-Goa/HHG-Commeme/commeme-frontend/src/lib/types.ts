export type Commeme = {
    id: string;
    commemeAddress: string;
    creator: string;
    isActive: boolean;
    timeToClose: BigInt;
    threshold: BigInt;
    totalSupply: BigInt;
    name: string;
    symbol: string;
    tokenAddress: string;
    metadata: string;
    poolAddress: string;
    totalDonation: BigInt;
    blockNumber: BigInt;
    blockTimestamp: BigInt;
    transactionHash: string;
    image?: string;       // Optional fields for enriched data
    description?: string; // Optional fields for enriched data
  };
  
export type CommemeQueryResult = {
    commemes: Commeme[];
  };
  interface PageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  }
interface CommemePage {
    items: Commeme[];
    pageInfo: PageInfo;
}
export interface CommemeDataResponseDaoCore {
    commemes: CommemePage;
}