import { client } from "../utils/graphql";
import { GET_TOPBAR_TRADES, GET_TRADES } from "../utils/query";
import { useQuery } from "@tanstack/react-query";
import { TradesData, TopBarTradesData, Trade, TopBarTrade } from "../constants/types";

export const useTrades = (tokenId: string, orderBy: string, limit: number) => {
  const fetchTrades = async (
    tokenId: string,
    orderBy: string,
    limit: number,
  ) => {
    if (tokenId === "") {
      return [];
    }
    const { trades } = await client.request<TradesData>(GET_TRADES, {
      orderBy,
      tokenId,
      limit,
    });
    return trades.items;
  };

  return useQuery<Trade[], Error>({
    queryKey: ["trades", tokenId, orderBy, limit],
    queryFn: () => fetchTrades(tokenId, orderBy, limit),
    enabled: tokenId !== "",
  });
};

export const useTopbarTrades = (limit: number, chainId: number) => {
  const fetchTopbarTrades = async (limit: number, chainId: number) => {
    const { trades } = await client.request<TopBarTradesData>(
      GET_TOPBAR_TRADES,
      {
        limit,
        chainId,
      },
    );
    return trades.items;
  };

  return useQuery<TopBarTrade[], Error>({
    queryKey: ["topbarTrades", limit, chainId],
    queryFn: () => fetchTopbarTrades(limit, chainId),
  });
};
