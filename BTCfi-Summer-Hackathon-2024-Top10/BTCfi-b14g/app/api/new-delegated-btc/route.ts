import pledgeAgentAbi from '@/abi/pledgeAgent.json';
import { NextRequest } from 'next/server';
import Web3 from 'web3';
import { getMongoDb } from '@/lib/db';
import { coreNetwork } from '@/constant/network';
import { CONTRACT_ADDRESS } from '@/constant/web3';
import { Collection } from 'mongodb';
import { errorResponse, response } from '@/utils/common';
interface EventData {
  txid: string;
  agent: string;
  delegator: string;
  script: string;
  blockHeight: bigint;
  outputIndex: bigint;
}

const checkDoubleSpending = async (
  delegator: string,
  coreTxId: string,
  delegatedCollection: Collection,
): Promise<boolean> => {
  const delegatorDoc = await delegatedCollection.findOne({ delegator });
  if (!delegatorDoc) return false;
  const listTx = delegatorDoc['histories'].map((el: any) => el.coreTxId);
  return listTx.includes(coreTxId);
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { coreTxId } = body;
    coreTxId = coreTxId.toLowerCase();
    if (!coreTxId)
      return response({ error: 'The coreTxId field is missing' }, 400);
    // Get transaction
    const web3 = new Web3(coreNetwork.rpcUrl);
    let transactionData;
    const contract = new web3.eth.Contract(
      pledgeAgentAbi,
      CONTRACT_ADDRESS.pledgeAgent,
    );

    try {
      transactionData = await web3.eth.getTransactionReceipt(coreTxId);
    } catch (error) {
      return response({ error: 'Invalid tx' }, 400);
    }
    if (transactionData.to !== CONTRACT_ADDRESS.pledgeAgent.toLowerCase())
      return response(
        { error: 'Invalid tx. Invalid pledgeAgent address' },
        400,
      );
    // Double spending
    const db = await getMongoDb();
    const delegatedCol = db.collection('delegated_btc');
    if (
      await checkDoubleSpending(
        transactionData.from.toLowerCase(),
        coreTxId,
        delegatedCol,
      )
    ) {
      return response({ error: 'Already saved' }, 400);
    }
    const log = transactionData.logs[0];

    const decodedLog = web3.eth.abi.decodeLog(
      [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'txid',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'agent',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'delegator',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'bytes',
          name: 'script',
          type: 'bytes',
        },
        {
          indexed: false,
          internalType: 'uint32',
          name: 'blockHeight',
          type: 'uint32',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'outputIndex',
          type: 'uint256',
        },
      ],
      log.data as string,
      log.topics?.slice(1) as string[],
    );
    const eventData: EventData = {
      txid: decodedLog.txid as string,
      agent: decodedLog.agent as string,
      delegator: decodedLog.delegator as string,
      script: decodedLog.script as string,
      blockHeight: decodedLog.blockHeight as bigint,
      outputIndex: decodedLog.outputIndex as bigint,
    };
    const btcData: {
      value: number;
      endRound: number;
    } = await contract.methods.btcReceiptMap(eventData.txid).call();
    await delegatedCol.updateOne(
      {
        delegator: transactionData.from,
      },
      {
        // @ts-ignore
        $push: {
          histories: {
            value: btcData.value.toString(),
            endRound: btcData.endRound.toString(),
            coreTxId,
            bitcoinTxId: eventData.txid,
            agent: eventData.agent,
            script: eventData.script,
            blockHeight: eventData.blockHeight.toString(),
            outputIndex: eventData.outputIndex.toString(),
          },
        },
      },
      {
        upsert: true,
      },
    );
    return response('OK');
  } catch (error) {
    console.error(error);
    return errorResponse();
  }
}
