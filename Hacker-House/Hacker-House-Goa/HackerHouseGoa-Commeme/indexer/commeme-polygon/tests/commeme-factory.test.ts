import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { CommemeCreated } from "../generated/schema"
import { CommemeCreated as CommemeCreatedEvent } from "../generated/CommemeFactory/CommemeFactory"
import { handleCommemeCreated } from "../src/commeme-factory"
import { createCommemeCreatedEvent } from "./commeme-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let commemeAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let creator = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newCommemeCreatedEvent = createCommemeCreatedEvent(
      commemeAddress,
      creator
    )
    handleCommemeCreated(newCommemeCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("CommemeCreated created and stored", () => {
    assert.entityCount("CommemeCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "CommemeCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "commemeAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "CommemeCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "creator",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
