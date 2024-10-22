import { Skeleton } from '@/components/skeleton';
import { TableRow, TableCell } from '@/components/ui/table';

export const RestakeRecordSkeleton = () => {
  return new Array(3).fill(1).map((_, idx) => (
    <TableRow key={`restake-record-skeleton-${idx}`}>
      <TableCell className="font-medium">
        <Skeleton className="h-4 w-[100px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[100px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[100px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="ml-auto h-4 w-[100px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="ml-auto h-4 w-[100px]" />
      </TableCell>
    </TableRow>
  ));
};
