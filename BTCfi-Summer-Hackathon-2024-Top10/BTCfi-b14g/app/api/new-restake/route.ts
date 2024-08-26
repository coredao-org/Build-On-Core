import { NextRequest } from 'next/server';
import Web3 from 'web3';
import { getMongoDb } from '@/lib/db';
import { coreNetwork } from '@/constant/network';
import { errorResponse, response } from '@/utils/common';
interface EventData {
  txHash: string;
  unlockTime: bigint;
  btcAmount: bigint;
  coreAmount: bigint;
}
const inputAbi = [
  {
    indexed: true,
    internalType: 'bytes32',
    name: 'txHash',
    type: 'bytes32',
  },
  {
    indexed: true,
    internalType: 'uint24',
    name: 'unlockTime',
    type: 'uint24',
  },
  {
    indexed: false,
    internalType: 'uint64',
    name: 'btcAmount',
    type: 'uint64',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'coreAmount',
    type: 'uint256',
  },
];

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

    try {
      transactionData = await web3.eth.getTransactionReceipt(coreTxId);
    } catch (error) {
      return response({ error: 'Invalid tx' }, 400);
    }
    const db = await getMongoDb();
    const restakeCol = db.collection('restake_history');
    const validatorCol = db.collection('validator');

    let result;
    const isNewTx =
      (await restakeCol.countDocuments({
        stakerAddress: transactionData.from,
        coreTxId: transactionData.transactionHash,
      })) === 0;

    const eventSignature = web3.utils.sha3(
      'Stake(bytes32,uint24,uint64,uint256)',
    );
    const log = transactionData.logs.filter((log) => {
      if (log.topics) {
        return log.topics[0] === eventSignature;
      }
      return false;
    })[0];
    const decodedLog = web3.eth.abi.decodeLog(
      inputAbi,
      log.data as string,
      log.topics?.slice(1) as string[],
    );
    const eventData: EventData = {
      txHash: decodedLog.txHash as string,
      unlockTime: decodedLog.unlockTime as bigint,
      btcAmount: decodedLog.btcAmount as bigint,
      coreAmount: decodedLog.coreAmount as bigint,
    };

    // Use for save to restake history col
    result = {
      coreAmount: eventData.coreAmount.toString(),
      unlockTime: eventData.unlockTime.toString(),
      btcAmount: eventData.btcAmount.toString(),
      coreTxId: transactionData.transactionHash.toString(),
      bitcoinTxId: eventData.txHash,
      stakerAddress: transactionData.from,
      validatorAddress: transactionData.to,
    };

    const validatorDocument = await validatorCol.findOne({
      validatorAddress: transactionData.to,
    });

    // Update in validator collection. Increate amount
    const coreDelegatedAmount: string = validatorDocument
      ? validatorDocument['coreAmount']
      : '0';
    const btcDelegatedAmount: string = validatorDocument
      ? validatorDocument['btcAmount']
      : '0';
    const txHistories = validatorDocument
      ? validatorDocument['txHistories']
      : [];
    if (!txHistories.includes(transactionData.transactionHash)) {
      await validatorCol.updateOne(
        {
          validatorAddress: transactionData.to,
        },
        {
          $set: {
            coreAmount: (
              Number(coreDelegatedAmount) + Number(result.coreAmount)
            ).toString(),
            btcAmount: (
              Number(btcDelegatedAmount) + Number(result.btcAmount)
            ).toString(),
          },
          // @ts-ignore
          $push: {
            // @ts-ignore
            txHistories: transactionData.transactionHash,
          },
        },
        {
          upsert: true,
        },
      );
    }
    // Check new tx
    if (isNewTx) {
      await restakeCol.updateOne({
        stakerAddress: result.stakerAddress,
        coreTxId: result.coreTxId
      }, {
        $set: result
      }, {
        upsert: true
      });
    } else {
      return response({ error: 'Already saved' }, 400);
    }
    return response('OK!');
  } catch (error) {
    console.error(error);
    return errorResponse();
  }
}
