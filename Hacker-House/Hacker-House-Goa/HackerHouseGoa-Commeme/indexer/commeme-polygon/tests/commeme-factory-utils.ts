import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import { CommemeCreated } from "../generated/CommemeFactory/CommemeFactory"

export function createCommemeCreatedEvent(
  commemeAddress: Address,
  creator: Address
): CommemeCreated {
  let commemeCreatedEvent = changetype<CommemeCreated>(newMockEvent())

  commemeCreatedEvent.parameters = new Array()

  commemeCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "commemeAddress",
      ethereum.Value.fromAddress(commemeAddress)
    )
  )
  commemeCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )

  return commemeCreatedEvent
}
