import { ponder } from "@/generated";

ponder.on("Commeme:CommemeCreated", async ({ event,context }) => {
  const { Commeme } = context.db;
  await Commeme.create({
    id: event.log.address,
    data:{
      blockNumber: event.log.blockNumber,
      blockTimestamp: BigInt(new Date().getTime()),
      transactionHash: event.log.transactionHash,
      commemeAddress: event.log.address,
      creator: event.args.sender,
      isActive: true,
      metadata: event.args.metadata,
      name: event.args.name,
      poolAddress: "0x0000000000000000000000000000000000000000",
      symbol: event.args.symbol,
      threshold: event.args.threshold,
      timeToClose: BigInt(new Date().getTime() + 86400),
      tokenAddress: "0x0000000000000000000000000000000000000000",
      totalDonation: BigInt(0),
      totalSupply: event.args.totalSupply
    }
  })
});

ponder.on("Commeme:Donation", async ({ event,context }) => {
  const { Commeme } = context.db
  await Commeme.update({
    id: event.log.address,
    data:{
      totalDonation: event.args.totalDonationAmount
    }
  })
});

ponder.on("Commeme:PoolCreated", async ({ event,context }) => {
  const { Commeme } = context.db
  await Commeme.update({
    id: event.log.address,
    data:{
      poolAddress: event.args.poolAddress
    }
  })
})

ponder.on("Commeme:TokenDeployed", async ({ event,context }) => {
  const { Commeme } = context.db
  await Commeme.update({
    id: event.log.address,
    data:{
      isActive: false,
      name: event.args.tokenName,
      symbol: event.args.tokenSymbol,
      tokenAddress: event.args.tokenAddress,
      totalSupply: event.args.totalSupply
    }
  })
})
