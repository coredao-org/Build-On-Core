// @ts-nocheck

import { SupportChainId } from '@/hooks/use-query-commemes';
import { http, createConfig } from 'wagmi';
import { Chain, coreDao, polygon } from 'wagmi/chains';

const chains = [coreDao, polygon] as any;


export  const config  = createConfig({
  chains,
  transports: {
    [coreDao.id]: http(),
    [polygon.id]: http(),
  },
}) as any;