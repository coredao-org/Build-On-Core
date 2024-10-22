'use client';
import { useValidatorContext } from '@/provider/validator-provider';
import { RestakeHistoriesTable } from '@/components/restake-history-table';

export const RestakeRecord = () => {
  const { restakeHistories, getRestakeHistory } = useValidatorContext();
  return (
    <div className="pt-4">
      <p className="font-semibold">
        Restake Records ({restakeHistories.totalCount})
      </p>
      <RestakeHistoriesTable
        data={restakeHistories}
        getRestakeHistory={getRestakeHistory}
      />
    </div>
  );
};
