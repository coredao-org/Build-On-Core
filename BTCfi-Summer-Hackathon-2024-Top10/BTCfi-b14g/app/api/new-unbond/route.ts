import { NextRequest } from 'next/server';
import Web3 from 'web3';
import { getMongoDb } from '@/lib/db';
import { coreNetwork } from '@/constant/network';
import { errorResponse, response } from '@/utils/common';
interface EventData {
  to: string;
  coreAmount: bigint;
  btcAmount: bigint;
}
const inputAbi = [
  {
    "indexed": false,
    "internalType": "address",
    "name": "to",
    "type": "address"
  },
  {
    "indexed": false,
    "internalType": "uint256",
    "name": "coreAmount",
    "type": "uint256"
  },
  {
    "indexed": false,
    "internalType": "uint256",
    "name": "btcAmount",
    "type": "uint256"
  }
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
    const unbondCol = db.collection('unbond_history');
    const validatorCol = db.collection('validator');

    let result;
    const isNewTx =
      (await unbondCol.countDocuments({
        stakerAddress: transactionData.from,
        coreTxId: transactionData.transactionHash,
      })) === 0;

    const eventSignature = web3.utils.sha3(
      'Unbond(address,uint256,uint256)',
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
      to: decodedLog.to as string,
      btcAmount: decodedLog.btcAmount as bigint,
      coreAmount: decodedLog.coreAmount as bigint,
    };

    // Use for save to restake history col
    result = {
      coreAmount: eventData.coreAmount.toString(),
      btcAmount: eventData.btcAmount.toString(),
      coreTxId: transactionData.transactionHash.toString(),
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
    const unbondTxHistories = validatorDocument
      ? validatorDocument['unbondTxHistories']
      : [];
    if (!unbondTxHistories.includes(transactionData.transactionHash)) {
      await validatorCol.updateOne(
        {
          validatorAddress: transactionData.to,
        },
        {
          $set: {
            coreAmount: (
              Number(coreDelegatedAmount) - Number(result.coreAmount)
            ).toString(),
            btcAmount: (
              Number(btcDelegatedAmount) - Number(result.btcAmount)
            ).toString(),
          },
          // @ts-ignore
          $push: {
            // @ts-ignore
            unbondTxHistories: transactionData.transactionHash,
          },
        },
        {
          upsert: true,
        },
      );
    }
    // Check new tx
    if (isNewTx) {
      await unbondCol.insertOne(result);
    } else {
      return response({ error: 'Already saved' }, 400);
    }
    return response('OK!');
  } catch (error) {
    console.error(error);
    return errorResponse();
  }
}
