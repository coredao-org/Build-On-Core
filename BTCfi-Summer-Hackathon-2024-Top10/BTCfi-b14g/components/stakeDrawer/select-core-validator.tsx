import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useDashboardContext } from '@/provider/dashboard-provider';
import { useValidatorContext } from '@/provider/validator-provider';
import { Record } from '@/types/coredao';
import { formatAmount } from '@/utils/common';
import { shortenString } from '@/utils/string';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { validator } from 'web3';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function SelectCoreValidator({
  coreValidator,
  setCoreValidator,
}: {
  coreValidator: Record | undefined;
  setCoreValidator: Dispatch<SetStateAction<Record | undefined>>;
}) {
  const { coredaoValidators } = useDashboardContext();
  const { coreValidatorStakedByUserAddress } = useValidatorContext();

  useEffect(() => {
    if (coreValidatorStakedByUserAddress === "0x0000000000000000000000000000000000000000") return;
    coredaoValidators.forEach((validator) => {
      if (
        validator.operatorAddressHash.toLowerCase() ===
        coreValidatorStakedByUserAddress?.toLowerCase()
      ) {
        setCoreValidator(validator);
      }
    });
  }, [coreValidatorStakedByUserAddress]);
  return (
    <div className="max-h-[300px] overflow-y-scroll">
      <Table className="relative">
        <TableHeader className="sticky top-0 bg-white">
          <TableRow>
            <TableHead>Validator</TableHead>
            <TableHead className="text-right">Commission</TableHead>
            <TableHead className="text-right">CORE Reward Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className={"cursor-pointer"}>
          {coredaoValidators.map((validator) => (
            <TableRow
              key={validator.operatorAddressHash}
              onClick={() => {
                if (coreValidatorStakedByUserAddress === "0x0000000000000000000000000000000000000000") {
                  setCoreValidator(validator);
                }
              }}
              className={cn('hover:bg-white', {
                '!bg-slate-300 font-semibold':
                  validator.operatorAddressHash ===
                  coreValidator?.operatorAddressHash,
              })}
            >
              <TableCell className="font-bold flex gap-2">
                <a
                  href={`https://stake.test.btcs.network/validator/${validator.operatorAddressHash}`}
                  target="_blank"
                >
                  {validator.operatorAddress.candidateName
                    ? validator.operatorAddress.candidateName
                    : shortenString(validator.operatorAddressHash, 4)}
                </a>
                {coreValidatorStakedByUserAddress !== "0x0000000000000000000000000000000000000000" && validator.operatorAddressHash ===
                  coreValidator?.operatorAddressHash && (
                  <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="text-muted-foreground" size={20} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className='font-medium'>Because you chose this validator last time.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                )}

              </TableCell>
              <TableCell className="text-right font-bold">
                {validator.commission / 10} %
              </TableCell>
              <TableCell className="text-right font-bold">
                {formatAmount(+validator.apr, 2)} %
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
