import { getMongoDb } from '@/lib/db';
import { errorResponse, response } from '@/utils/common';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      delegatorAddress: string;
    };
  },
) {
  try {
    let { delegatorAddress } = params;
    if (!delegatorAddress)
      return new Response(JSON.stringify({ error: 'Missing address' }), {
        status: 400,
      });
    delegatorAddress = delegatorAddress.toString();

    const db = await getMongoDb();
    const restakeHistoryCol = db.collection('restake_history');
    const unbondCol = db.collection('unbond_history');
    const restakeRes = await restakeHistoryCol
      .aggregate([
        {
          $match: {
            stakerAddress: delegatorAddress,
          },
        },
        {
          $addFields: {
            coreAmountAsNumber: { $toDouble: '$coreAmount' },
            btcAmountAsNumber: { $toDouble: '$btcAmount' },
          },
        },
        {
          $group: {
            _id: null,
            totalCoreAmount: {
              $sum: '$coreAmountAsNumber',
            },
            totalBtcAmount: {
              $sum: '$btcAmountAsNumber',
            },
          },
        },
        {
          $project: {
            _id: false,
            totalCoreAmount: true,
            totalBtcAmount: true,
          },
        },
      ])
      .toArray();

      const unbondRes = await unbondCol
      .aggregate([
        {
          $match: {
            stakerAddress: delegatorAddress,
          },
        },
        {
          $addFields: {
            coreAmountAsNumber: { $toDouble: '$coreAmount' },
            btcAmountAsNumber: { $toDouble: '$btcAmount' },
          },
        },
        {
          $group: {
            _id: null,
            totalCoreAmount: {
              $sum: '$coreAmountAsNumber',
            },
            totalBtcAmount: {
              $sum: '$btcAmountAsNumber',
            },
          },
        },
        {
          $project: {
            _id: false,
            totalCoreAmount: true,
            totalBtcAmount: true,
          },
        },
      ])
      .toArray();
    if (restakeRes.length === 0) {
      return response({
        data: {
          totalCoreAmount: '0',
          totalBtcAmount: '0',
        },
      });
    } 
    
    if(unbondRes.length === 0) {
      return response({
        data: {
          totalCoreAmount: restakeRes[0].totalCoreAmount.toString(),
        totalBtcAmount: restakeRes[0].totalBtcAmount.toString(),
        },
      });
    }

    const currentBtcAmount = Number(restakeRes[0].totalBtcAmount) - Number(unbondRes[0].totalBtcAmount);
    const currentCoreAmount = Number(restakeRes[0].totalCoreAmount) - Number(unbondRes[0].totalCoreAmount);
    return response({
      data: {
        totalCoreAmount: currentCoreAmount,
        totalBtcAmount: currentBtcAmount,
      },
    });
  } catch (error) {
    console.error(error);
    return errorResponse();
  }
}
