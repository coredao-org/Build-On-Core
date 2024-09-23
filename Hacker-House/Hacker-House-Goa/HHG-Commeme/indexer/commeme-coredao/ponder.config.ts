import { createConfig } from "@ponder/core";
import { parseAbiItem } from "abitype";
import { http } from "viem";

import { CommemeAbi } from "./abis/CommemeAbi";

const commemeFactoryEvent = parseAbiItem(
  "event CommemeCreated(address indexed commemeAddress, address indexed creator)",
);

export default createConfig({
  networks: {
    coredao: {
      chainId: 1116,
      transport: http(process.env.PONDER_RPC_URL_1116),
    },

  },
  contracts: {
    Commeme: {
      network: "coredao",
      abi: CommemeAbi,
      factory: {
        address: "0xb8F55945296407B8f9a7095F0c71b221a257b2F2",
        event: commemeFactoryEvent,
        parameter: "commemeAddress",
      },
      startBlock: 16624950,
    },
  },
});
