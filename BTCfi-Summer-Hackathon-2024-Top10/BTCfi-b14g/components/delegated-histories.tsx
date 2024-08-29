import { PriceFeedData } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { coreNetwork, mempoolUrl } from '@/constant/network';
import { cn } from '@/lib/utils';
import { useOkxWalletContext } from '@/provider/okx-wallet-provider';
import { DelegatedModel, DelegateHistory } from '@/types/model';
import { convertRoundToDate, formatAmount } from '@/utils/common';
import { shortenString } from '@/utils/string';
import { Info } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function removeDuplicate(data: DelegateHistory[]){
  const copyData = data.slice();
  const seen = new Set();
  return copyData.reduce((acc : any, obj) => {
    if (!seen.has(obj.coreTxId)) {
      seen.add(obj.coreTxId);
      acc.push(obj);
    }
    return acc;
  }, []);
}
export function DelegateBtcHistories({
  setBtcTx,
  btcTx,
  forceUpdate,
  priceFeedData
}: {
  btcTx: DelegateHistory | undefined;
  setBtcTx: (btcTx: DelegateHistory) => void;
  forceUpdate?: boolean;
  priceFeedData: PriceFeedData
}) {
  const { address, connect } = useOkxWalletContext();
  const [histories, setHistories] = useState<DelegateHistory[]>([]);
  const [loading, setLoading] = useState<Boolean>(false);

  const getHistory = async () => {
    try {
      if (!address) return;
      setLoading(true);
      const res = await fetch(`/api/delegated-btc-history/${address}`);
      const data = (await res.json()) as DelegateHistory[];
      if(data) {
        const listDelegated = removeDuplicate(data);
        setHistories(listDelegated ?? []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHistory();
  }, [address]);

  useEffect(() => {
    getHistory();
  }, [forceUpdate]);

  const divRef = useRef<HTMLDivElement>(null);
  return (
    <div className="max-h-[300px] overflow-y-scroll" ref={divRef}>
      <Table className="relative">
        <TableHeader className="sticky top-0 bg-white">
          <TableRow>
            <TableHead>Core Chain Txn</TableHead>
            <TableHead>BTC Delegated</TableHead>
            <TableHead className="text-right">End Reward Round</TableHead>
            <TableHead className="text-right">CORE Required
            
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className={"cursor-pointer"}>
          {histories?.map((history, index) => (
            <TableRow
              key={`btc-delegated-${index}`}
              onClick={() => setBtcTx(history)}
              className={cn('hover:bg-white', {
                '!bg-slate-300 font-semibold':
                  history.bitcoinTxId === btcTx?.bitcoinTxId,
              })}
            >
              <TableCell className="font-medium flex item-center gap-1">
              
                <a
                  href={`${coreNetwork.blockExplorerUrl}/tx/${history.coreTxId}`}
                  target="_blank"
                >
                  {shortenString(history.coreTxId)}
                  
                </a>
                {history.fromCoreReal && <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="text-muted-foreground" size={20} />
                      </TooltipTrigger>
                      <TooltipContent className='font-medium max-w-96'>
                        <p>This is real lock transaction.</p>
                      </TooltipContent>
                    </Tooltip>
                </TooltipProvider>}
              </TableCell>
              <TableCell>
                <span className="font-bold">
                  {formatAmount(+history.value / 1e8, 7)}
                </span>{' '}
                BTC
              </TableCell>
              <TableCell className="text-right">{convertRoundToDate(history.endRound)}</TableCell>
              <TableCell className="text-right">
                <span className="font-bold">
                  {formatAmount(
                    (parseInt(history.value.toString()) * 3 * Number(Number(priceFeedData?.price) / 1e18)) / 1e9,
                    9,
                  )}
                </span>{' '}
                CORE
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!loading && histories?.length === 0 && (
        <div className="text-center my-6 text-sm">No Data to Display</div>
      )}
      <div className="text-xs text-center text-muted-foreground">
        A list of your recent btc transaction delegate at Core.
      </div>
    </div>
  );
}
