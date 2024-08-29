import { DelegateBtcHistories } from '@/components/delegated-histories';
import { formatBalance } from '@/components/stakeDrawer/stake-drawer';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useDashboardContext } from '@/provider/dashboard-provider';
import { useValidatorContext } from '@/provider/validator-provider';
import { PriceFeedData } from '@/types';
import { DelegateHistory } from '@/types/model';
import { formatAmount } from '@/utils/common';
import { ReloadIcon } from '@radix-ui/react-icons';
import { formatEther, formatUnits } from 'ethers';
import { Dispatch, SetStateAction } from 'react';
export const SelectTxLock = ({
  generate,
  loadingGenerateMock,
  setBtcTx,
  btcTx,
  forceUpdateHistory,
  priceFeedData,
}: {
  generate: () => {};
  loadingGenerateMock: boolean;
  setBtcTx: Dispatch<SetStateAction<DelegateHistory | undefined>>;
  btcTx: DelegateHistory;
  forceUpdateHistory: boolean;
  priceFeedData: PriceFeedData;
}) => {
  const { coreBalance, vBtcBalance } = useDashboardContext();
  return (
    <>
      <DrawerHeader>
        <div className="flex justify-between">
          <div>
            <DrawerTitle className="mb-2">Restake</DrawerTitle>
            <DrawerDescription>
              Choose your Bitcoin transaction delegate prior to restaking.
            </DrawerDescription>
          </div>
          <div className="select-text flex flex-col items-end gap-1">
            <div>
              <span className="text-sm">Your CORE | vBTC</span> :{' '}
              <span className="font-bold">
                {formatAmount(+formatEther(coreBalance), 3)}
              </span>{' '}
              | <span className="font-bold">{formatUnits(vBtcBalance, 8)}</span>
            </div>
            <Button
              className="w-min text-sm bg-green-600 hover:bg-green-700"
              onClick={generate}
              disabled={!!loadingGenerateMock}
            >
              Generate lock btc{' '}
              {loadingGenerateMock && (
                <ReloadIcon className="ml-1 h-4 w-4 animate-spin" />
              )}
            </Button>
          </div>
        </div>
      </DrawerHeader>
      <div className="p-4 pb-0 select-text">
        <DelegateBtcHistories
          setBtcTx={setBtcTx}
          btcTx={btcTx}
          forceUpdate={forceUpdateHistory}
          priceFeedData={priceFeedData as PriceFeedData}
        />
      </div>
    </>
  );
};
