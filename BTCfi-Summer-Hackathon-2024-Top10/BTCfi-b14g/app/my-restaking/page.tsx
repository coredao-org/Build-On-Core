'use client';
import { ClaimHistoriesTable } from '@/components/claim-history-table';
import { LoadingModal, useModal } from '@/components/loading-modal';
import { RestakeHistoriesTable } from '@/components/restake-history-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMyStakingContext } from '@/provider/my-staking-provider';
import { useOkxWalletContext } from '@/provider/okx-wallet-provider';
import { formatAmount } from '@/utils/common';
import { shortenString } from '@/utils/string';
import { useEffect } from 'react';

export default function MyStakingPage() {
  const { connect, address } = useOkxWalletContext();
  const {
    btcDelegated,
    coreDelegated,
    claimHistory,
    restakeHistory,
    getRestakeHistory,
  } = useMyStakingContext();
  const { modalStatus, modalTitle, modalOpen, setModalOpen, modalHash } =
    useModal();

  const claim = async () => {};

  return (
    <>
      <LoadingModal
        modalStatus={modalStatus}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        modalTitle={modalTitle}
        modalHash={modalHash}
      />
      <main className="container">
        <div className="space-y-2 text-center my-8">
          <h2 className="scroll-m-20 text-3xl font-semibold">Delegator</h2>
          <h4 className="mt-4">{shortenString(address)}</h4>
        </div>
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 justify-center">
          <Card className="text-center">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2 justify-center">
              <CardTitle className="text-sm font-medium">
                CORE Delegated
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="text-2xl font-bold">
                {formatAmount(+coreDelegated / 1e18)} CORE
              </div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2 justify-center">
              <CardTitle className="text-sm font-medium">
                BTC Delegated
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="text-2xl font-bold">
                {formatAmount(+btcDelegated / 1e8)} BTC
              </div>
            </CardContent>
          </Card>
        </section>
        <Tabs defaultValue="restake" className="my-6">
          <TabsList className="flex gap-6 w-max">
            <TabsTrigger value="restake">
              Restake ({restakeHistory.totalCount})
            </TabsTrigger>
            <TabsTrigger value="claim">
              Claim ({claimHistory.totalCount})
            </TabsTrigger>
          </TabsList>
          <Separator className="mb-4" />
          <TabsContent value="restake">
            <RestakeHistoriesTable
              data={restakeHistory}
              getRestakeHistory={getRestakeHistory}
            />
          </TabsContent>
          <TabsContent value="claim">
            <ClaimHistoriesTable data={claimHistory} />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
