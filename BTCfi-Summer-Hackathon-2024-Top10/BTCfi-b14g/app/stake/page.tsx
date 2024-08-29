'use client';
import pledgeAgentAbi from '@/abi/pledgeAgent.json';
import { Button } from '@/components/ui/button';
import { getRandomData } from '@/constant/data';
import { CONTRACT_ADDRESS } from '@/constant/web3';
import { useContract } from '@/hooks/useContract';
import { useOkxWalletContext } from '@/provider/okx-wallet-provider';
import { formatAmount } from '@/utils/common';
import { shortenString } from '@/utils/string';
import { switchOrCreateNetwork } from '@/utils/wallet';
import { ethers } from 'ethers';
import { useState } from 'react';
import Web3 from 'web3';

const web3 = new Web3();
export default function StakePage() {
  const { account, provider, address, connect, evmProvider, signer, chainId } =
    useOkxWalletContext();
  const [preview, setPreview] = useState<{
    txId: string;
    endRound: number;
    staker: string;
    value: number;
  }>({
    txId: '',
    endRound: 0,
    staker: '',
    value: 0,
  });
  const pledgeAgentContract = useContract(
    CONTRACT_ADDRESS.pledgeAgent,
    pledgeAgentAbi,
    evmProvider,
    signer,
  ) as ethers.Contract;

  async function generate() {
    try {
      await switchOrCreateNetwork(chainId);
      const mockData = getRandomData();
      const btcReiceipt = {
        endRound: mockData.endRound,
        value: +mockData.btcValue,
        delegator: address,
        agent: '0x651dA43BE21FdB85615A58350Cc09D019C3f47c4',
        fee: 0,
        feeReceiver: '0x0000000000000000000000000000000000000000',
        rewardIndex: 1,
      };

      setPreview({
        txId: mockData.btcTxId,
        staker: address as string,
        value: +mockData.btcValue,
        endRound: mockData.endRound,
      });
      const tx = await pledgeAgentContract.updateBtcReiptMock(
        '0x' + mockData.btcTxId,
        btcReiceipt,
        '0x' + mockData.btcTxId,
        web3.utils.hexToBytes(web3.utils.asciiToHex(mockData.script)),
        mockData.btcBlockHeight,
        0,
      );
      await tx.wait()
      await fetch('/api/new-delegated-btc', {
        method: 'POST',
        body: JSON.stringify({
          coreTxId: tx.hash,
        }),
        headers: {
          'Content-type': 'application/json',
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className="flex flex-col items-center justify-center my-auto">
      <div className="grid grid-items-center">
        {account ? (
          <Button onClick={generate}>Generate mock stake btc</Button>
        ) : (
          <Button onClick={connect}>Connect wallet</Button>
        )}
      </div>
      {/* Preview */}
      {preview.staker !== '' && (
        <>
          <div className="my-6 container">
            <table className="w-full">
              <thead>
                <tr className="m-0 border-t p-0 even:bg-muted">
                  <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                    Transaction id
                  </th>
                  <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                    Staker
                  </th>
                  <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                    Amount
                  </th>
                  <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                    End round
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="m-0 border-t p-0 even:bg-muted">
                  <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                    {shortenString(preview.txId)}
                  </td>
                  <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                    {shortenString(preview.staker)}
                  </td>
                  <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                    {formatAmount(preview.value, 8)} BTC
                  </td>
                  <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                    {preview.endRound}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div></div>
        </>
      )}
    </section>
  );
}
