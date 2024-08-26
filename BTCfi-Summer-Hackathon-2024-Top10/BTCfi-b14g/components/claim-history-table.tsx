import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { shortenString } from '@/utils/string';
import { formatAmount } from '@/utils/common';
import { coreNetwork } from '@/constant/network';
import { ClaimHistoryWithLoading } from '@/types/model';
import { RestakeRecordSkeleton } from '@/components/skeleton/restake-record-skeleton';

export const ClaimHistoriesTable = ({
  data,
}: {
  data: ClaimHistoryWithLoading;
}) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">Claim Txn</TableHead>
            <TableHead>Reward B14G Amount</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.isLoading && <RestakeRecordSkeleton />}
          {!data.isLoading &&
            data.data.length > 0 &&
            data.data.map((el) => (
              <TableRow key={el.coreTxId}>
                <TableCell>
                  <a
                    href={`${coreNetwork.blockExplorerUrl}/tx/${el.coreTxId}`}
                    target="_blank"
                  >
                    {shortenString(el.coreTxId)}
                  </a>
                </TableCell>
                <TableCell>
                  <span className="font-bold">
                    {formatAmount(+el.btcAmount / 1e18,8)}
                  </span>{' '}
                  B14G
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {!data.isLoading && data.data.length === 0 && (
        <div className="text-center my-20">No Data to Display</div>
      )}
    </>
  );
};
