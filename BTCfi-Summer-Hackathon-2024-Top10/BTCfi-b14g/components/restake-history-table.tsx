import CustomPagination from '@/components/pagination';
import { RestakeRecordSkeleton } from '@/components/skeleton/restake-record-skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { coreNetwork, mempoolUrl } from '@/constant/network';
import { RestakeHistoryWithLoading } from '@/types/model';
import { convertRoundToDate, formatAmount } from '@/utils/common';
import { shortenString } from '@/utils/string';

export const RestakeHistoriesTable = ({
  data,
  getRestakeHistory,
}: {
  data: RestakeHistoryWithLoading;
  getRestakeHistory: (page: number) => void;
}) => {
  const handlePageChange = (page: number) => {
    getRestakeHistory(page);
  };
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Restake txn</TableHead>
            <TableHead>Staker address</TableHead>
            <TableHead>BTC Delegated</TableHead>
            <TableHead className="text-right">CORE Delegated</TableHead>
            <TableHead className="text-right">Unlock Time</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.isLoading && <RestakeRecordSkeleton />}
          {!data.isLoading &&
            data.data.length > 0 &&
            data.data.map((el) => (
              <TableRow key={el.coreTxId}>
                <TableCell className="font-medium">
                  <a
                    href={`${coreNetwork.blockExplorerUrl}/tx/${el.coreTxId}`}
                    target="_blank"
                  >
                    {shortenString(el.coreTxId)}
                  </a>
                </TableCell>
                <TableCell className="font-medium">
                    {shortenString(el.stakerAddress)}
                </TableCell>
                <TableCell>
                  <span className="font-bold">
                    {formatAmount(+el.btcAmount / 1e8)}
                  </span>{' '}
                  BTC
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-bold">
                    {formatAmount(+el.coreAmount / 1e18)}
                  </span>{' '}
                  CORE
                </TableCell>
                <TableCell className="text-right">{convertRoundToDate(el.unlockTime)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {!data.isLoading && data.data.length === 0 && (
        <div className="text-center my-20">No Data to Display</div>
      )}
      <CustomPagination
        currentPage={data.page}
        totalPages={data.totalPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
