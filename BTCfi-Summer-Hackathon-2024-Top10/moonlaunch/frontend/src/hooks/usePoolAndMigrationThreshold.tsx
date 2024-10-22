import { Config, useClient } from "wagmi";
import { Address, formatEther } from "viem";
import { useQuery } from "@tanstack/react-query";
import { getCurveConfig } from "../utils/helper";
import { readContract } from "viem/actions";

interface TokenPool {
  token: Address;
  lastPrice: bigint;
  migrated: boolean;
}

interface PoolAndThresholdData {
  pool: TokenPool;
  bondingPercentage: string;
}

const fetchPoolAndMigrationThreshold = async (
  addr: Address,
  config: Config,
): Promise<PoolAndThresholdData> => {
  const client = config.getClient();
  const curveConfig = getCurveConfig(client.chain.id);
  const tokenPoolResult = await readContract(client, {
    ...curveConfig,
    functionName: "tokenPool",
    args: [addr],
  });

  if (!tokenPoolResult) {
    throw new Error("Failed to fetch pool data or migration threshold");
  }
  const targetMcap = tokenPoolResult[6];
  const pool: TokenPool = {
    token: tokenPoolResult[0],
    lastPrice: tokenPoolResult[5],
    migrated: tokenPoolResult[12],
  };

  const curveProgress =
    (Number(formatEther(tokenPoolResult[3])) /
      Number(formatEther(targetMcap))) *
    100;
  const bondingPercentage = parseFloat(curveProgress.toString()).toFixed(2);

  return { pool, bondingPercentage };
};

export const usePoolAndMigrationThreshold = (addr: Address, config: Config) => {
  const client = useClient();
  client?.chain.id;
  return useQuery<PoolAndThresholdData, Error>({
    queryKey: ["poolAndMigrationThreshold", addr],
    queryFn: () => fetchPoolAndMigrationThreshold(addr, config),
  });
};
