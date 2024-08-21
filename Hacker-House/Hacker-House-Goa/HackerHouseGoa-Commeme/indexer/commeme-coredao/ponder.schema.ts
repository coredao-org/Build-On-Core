import { createSchema } from "@ponder/core";

export default createSchema((p) => ({

  Commeme: p.createTable({
    id: p.string(),
    commemeAddress: p.string(),
    creator: p.string(),
    isActive: p.boolean(),
    timeToClose: p.bigint(),
    threshold: p.bigint(),
    totalSupply: p.bigint(),
    name: p.string(),
    symbol: p.string(),
    tokenAddress: p.string(),
    metadata: p.string(),
    poolAddress: p.string(),
    totalDonation: p.bigint(),
    blockNumber: p.bigint(),
    blockTimestamp: p.bigint(),
    transactionHash: p.string(),
  }),
}));
