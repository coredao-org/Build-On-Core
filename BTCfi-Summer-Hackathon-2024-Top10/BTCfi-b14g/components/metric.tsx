'use client';
import { Info } from 'lucide-react';

import { CopyWrapper } from '@/components/copy-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import restakeAbi from '@/abi/restake.json';
import { LoadingModal, useModal } from '@/components/loading-modal';
import { Button } from '@/components/ui/button';
import { useContract } from '@/hooks/useContract';
import { useDashboardContext } from '@/provider/dashboard-provider';
import { useOkxWalletContext } from '@/provider/okx-wallet-provider';
import { useValidatorContext } from '@/provider/validator-provider';
import { formatAmount, getErrorMessage } from '@/utils/common';
import { shortenString } from '@/utils/string';
import { Contract, formatUnits, parseUnits } from 'ethers';
import { useEffect } from 'react';
import { DelegatorIcon } from '@/components/icon/delegator-icon';
import { UnbondCard } from '@/components/unbond-card';
import { switchOrCreateNetwork } from '@/utils/wallet';

export const Metric = () => {
  const { coreApr } = useDashboardContext();
  const {
    delegatedCoin,
    restakeApr,
    validatorAddress,
    delegatorsCount,
    commission,
    reward,
    getReward,
    coreDelegatedCoin,
    coreReward,
  } = useValidatorContext();
  const { evmProvider, address, signer, chainId, connect } =
    useOkxWalletContext();
  const {
    modalStatus,
    setModalStatus,
    modalTitle,
    setModalTitle,
    modalOpen,
    setModalOpen,
    setModalHash,
    modalHash,
  } = useModal();

  const restakeContract = useContract(
    validatorAddress,
    restakeAbi,
    evmProvider,
    signer,
  ) as Contract;

  const claimB14g = async () => {
    try {
      await switchOrCreateNetwork(chainId)
      setModalOpen(true);
      setModalStatus('LOADING');
      setModalHash('');
      setModalTitle('Claim reward');
      const tx = await restakeContract.claimReward();
      setModalHash(tx.hash);
      await tx.wait();
      setModalStatus('SUCCESS');
      setModalTitle('Done.');
      getReward();
    } catch (error: any) {
      if (error.code === 'ACTION_REJECTED') {
        setModalOpen(false);
        setModalTitle('');
      } else {
        setModalStatus('ERROR');
        setModalTitle(getErrorMessage(error));
      }
      console.error(error);
    }
  };

  const claimCore = async () => {
    try {
      await switchOrCreateNetwork(chainId);
      setModalOpen(true);
      setModalStatus('LOADING');
      setModalHash('');
      setModalTitle('Claim reward');
      const tx = await restakeContract.claimCore(address);
      setModalHash(tx.hash);
      await tx.wait();
      setModalStatus('SUCCESS');
      setModalTitle('Done.');
      getReward();
    } catch (error: any) {
      if (error.code === 'ACTION_REJECTED') {
        setModalOpen(false);
        setModalTitle('');
      } else {
        setModalStatus('ERROR');
        setModalTitle(getErrorMessage(error));
      }
      console.error(error);
    }
  };

  return (
    <>
    <div className="flex flex-wrap gap-4 justify-center -mx-2">
      <LoadingModal
        modalStatus={modalStatus}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        modalTitle={modalTitle}
        modalHash={modalHash}
      />
      <Card className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)] px-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delegated Coin</CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="text-2xl font-bold">
            {formatAmount(
              Number(formatUnits(Number(delegatedCoin).toString(), 8)),
            )}{' '}
            BTC <span className="font-normal">|</span>{' '}
            {formatAmount(
              Number(formatUnits(Number(coreDelegatedCoin).toString(), 18)),
            )}{' '}
            Core
          </div>
        </CardContent>
      </Card>
      <Card className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)] px-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Max APR</CardTitle>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="text-muted-foreground" size={20} />
              </TooltipTrigger>
              <TooltipContent className="max-w-96">
                <p>
                  The APR value is calculated by adding the maximum value from
                  CoreDAO to the value from the validator.
                </p>
                <p>
                  Max | Min BTC Reward Rate:{' '}
                  <span className="font-bold">
                    {formatAmount(+coreApr.max, 3)}
                  </span>{' '}
                  |{' '}
                  <span className="font-bold">
                    {formatAmount(+coreApr.min, 3)}
                  </span>{' '}
                  %
                </p>
                <p>
                  Observer Apr:{' '}
                  <span className="font-bold">
                    {formatAmount(+restakeApr, 5)}
                  </span>{' '}
                  %
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="text-2xl font-bold">
            {formatAmount(+restakeApr + +coreApr.max, 3)} %
          </div>
        </CardContent>
      </Card>
      <Card className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)] px-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Commission</CardTitle>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="text-muted-foreground" size={20} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Revenue received by a observer is split between the observer and their delegators. Commission is the part taken by the observer, which is set as a percentage.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="text-2xl font-bold">{commission} %</div>
        </CardContent>
      </Card>
      <Card className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)] px-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">BTC Delegators</CardTitle>
          <DelegatorIcon />
        </CardHeader>
        <CardContent className="mt-4">
          <div className="text-2xl font-bold">{delegatorsCount}</div>
        </CardContent>
      </Card>
    </div>
    <h2 className="text-2xl font-bold tracking-tight">My Staking</h2>
    <div className="flex flex-wrap gap-4 justify-center -mx-4">
      <Card className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33%-1rem)] px-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Your B14G reward
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="font-bold flex justify-between items-center">
            <p className="text-lg">
              {formatAmount(Number(reward) / 1e18, 8)} B14G{' '}
            </p>
            <Button
              onClick={claimB14g}
              disabled={Number(formatAmount(Number(reward) / 1e18, 8)) === 0}
            >
              Claim
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33%-1rem)] px-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Your CORE reward
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="font-bold flex justify-between items-center">
            <p className="text-lg">
              {formatAmount(Number(coreReward) / 1e18, 5)} CORE{' '}
            </p>
            <Button
              onClick={claimCore}
              disabled={
                Number(formatAmount(Number(coreReward) / 1e18, 5)) === 0
              }
            >
              Claim
            </Button>
          </div>
        </CardContent>
      </Card>
      <UnbondCard />
      </div>
      </>
  );
};
