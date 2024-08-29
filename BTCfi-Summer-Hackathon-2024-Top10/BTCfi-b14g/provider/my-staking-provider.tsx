'use client';
import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from 'react';
import {
  ClaimHistoryWithLoading,
  RestakeHistory,
  RestakeHistoryWithLoading,
} from '@/types/model';
import { useOkxWalletContext } from '@/provider/okx-wallet-provider';

type Props = {
  btcDelegated: string;
  coreDelegated: string;
  restakeHistory: RestakeHistoryWithLoading;
  claimHistory: ClaimHistoryWithLoading;
  getRestakeHistory: (page: number) => void;
  getClaimHistory: () => void;
  getTotalDelegated: () => void;
};

const defaultValues: Props = {
  btcDelegated: '0',
  coreDelegated: '0',
  restakeHistory: {
    data: [],
    isLoading: false,
    page: 1,
    totalCount: 0,
    totalPage: 1,
  },
  claimHistory: {
    data: [],
    isLoading: false,
    page: 1,
    totalCount: 0,
    totalPage: 1,
  },
  getRestakeHistory: () => {},
  getClaimHistory: () => {},
  getTotalDelegated: () => {},
};

const MyStakingContext = createContext(defaultValues);

export const MyStakingProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { address } = useOkxWalletContext();
  const [btcDelegated, setBtcDelegated] = useState(defaultValues.btcDelegated);
  const [coreDelegated, setCoreDelegated] = useState(
    defaultValues.coreDelegated,
  );
  const [restakeHistory, setRestakeHistory] = useState<Props['restakeHistory']>(
    defaultValues.restakeHistory,
  );
  const [claimHistory, setClaimHistory] = useState<Props['claimHistory']>(
    defaultValues.claimHistory,
  );

  const getTotalDelegated = async () => {
    try {
      const res = await fetch(`/api/my-staking/${address}`);
      if (res.status === 200) {
        const data = await res.json();
        setCoreDelegated(data.data.totalCoreAmount);
        setBtcDelegated(data.data.totalBtcAmount);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getRestakeHistory = async (page = 1) => {
    try {
      setRestakeHistory({
        ...restakeHistory,
        isLoading: true,
      });
      const res = await fetch(`/api/restake-history?page=${page}`, {
        method: 'POST',
        body: JSON.stringify({
          stakerAddress: address,
        }),
        headers: {
          'Content-type': 'application/json',
        },
      });
      if (res.status === 200) {
        const data = (await res.json()) as RestakeHistory;
        setRestakeHistory({
          data: data.data,
          page: data.page,
          totalCount: data.totalCount,
          totalPage: data.totalPage,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRestakeHistory((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };
  const getClaimHistory = async () => {
    try {
      setClaimHistory({
        ...claimHistory,
        isLoading: true,
      });
      const res = await fetch(`/api/claim-history/${address}`, {
        method: 'GET',
      });
      if (res.status === 200) {
        const data = (await res.json()) as ClaimHistoryWithLoading; // no loading
        setClaimHistory({
          data: data.data,
          page: data.page,
          totalCount: data.totalCount,
          totalPage: data.totalPage,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setClaimHistory((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  useEffect(() => {
    if (address) {
      getRestakeHistory();
      getClaimHistory();
      getTotalDelegated();
    }
  }, [address]);

  const value = useMemo(() => {
    return {
      btcDelegated,
      coreDelegated,
      restakeHistory,
      claimHistory,
      getClaimHistory,
      getRestakeHistory,
      getTotalDelegated,
    };
  }, [btcDelegated, coreDelegated, restakeHistory, claimHistory]);

  return (
    <MyStakingContext.Provider value={value}>
      {children}
    </MyStakingContext.Provider>
  );
};
export const useMyStakingContext = () => {
  return useContext(MyStakingContext);
};
