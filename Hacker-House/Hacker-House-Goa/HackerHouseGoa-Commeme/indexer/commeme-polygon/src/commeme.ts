import { PoolCreated as PoolCreatedEvent, TokenDeployed as TokenDeployedEvent, LiquidityAdded as LiquidityAddedEvent,CommemeCreated as CommemeCreatedEvent,Donation as DonationEvent  } from "../generated/templates/Commeme/Commeme"
import { Commeme } from "../generated/schema"

import {BigInt,Bytes} from "@graphprotocol/graph-ts"
// Handler for CommemeCreated event
export function handleCommemeCreated(event: CommemeCreatedEvent): void {

  let entityCommeme = new Commeme(event.address.toHexString())
  entityCommeme.creator = event.params.sender;
  entityCommeme.metadata = event.params.metadata;
  entityCommeme.threshold = event.params.threshold;
  entityCommeme.name = event.params.name;
  entityCommeme.symbol = event.params.symbol;
  entityCommeme.totalSupply = event.params.totalSupply;
  entityCommeme.blockNumber = event.block.number;
  entityCommeme.blockTimestamp = event.block.timestamp;
  entityCommeme.transactionHash = event.transaction.hash;
  
  entityCommeme.timeToClose = event.block.timestamp.plus(BigInt.fromI32(86400))

  entityCommeme.tokenAddress = Bytes.fromHexString("0x0000000000000000000000000000000000000000")
  entityCommeme.totalDonation = BigInt.fromI32(0)

  entityCommeme.commemeAddress = Bytes.fromHexString(event.address.toHexString())
  entityCommeme.isActive = true;
  entityCommeme.poolAddress = "0x0000000000000000000000000000000000000000";

  entityCommeme.save()

}


// Handler for Donation event
export function handleDonation(event: DonationEvent): void {
  let entityComme = Commeme.load(event.address.toHexString())
  if(!entityComme){
    throw new Error("entity not found")
  }
  entityComme.totalDonation = event.params.totalDonationAmount;
  entityComme.save()
}

// Handler for PoolCreated event
export function handlePoolCreated(event: PoolCreatedEvent): void {
  let entityComme = Commeme.load(event.address.toHexString())
  if(!entityComme){
    throw new Error("Error entity")
  }
  entityComme.poolAddress = event.params.poolAddress.toHexString();
  entityComme.save()
}

// Handler for TokenDeployed event
export function handleTokenDeployed(event: TokenDeployedEvent): void {
  let commeEntity = Commeme.load(event.address.toHexString())
  if(!commeEntity){
    throw new Error("Error entity")
  }
  commeEntity.tokenAddress = event.params.tokenAddress;
  commeEntity.name = event.params.tokenName;
  commeEntity.symbol = event.params.tokenSymbol;
  commeEntity.totalSupply = event.params.totalSupply;
  commeEntity.isActive = false;
  commeEntity.save()
}
