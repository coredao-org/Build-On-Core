import { getMongoDb } from '@/lib/db';
import { errorResponse, response } from '@/utils/common';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: { delegatorAddress: string };
  },
) {
  try {
    const db = await getMongoDb();
    const delegatedCol = db.collection('delegated_btc');
    const delegatedRealCol = db.collection('delegated_btc_real');
    const restakeCol = db.collection("restake_history");
    
    const delegatorAddress = params.delegatorAddress;
    const mockHistory = await delegatedCol.findOne(
      {
        delegator: delegatorAddress.toLowerCase(),
      },
      {
        projection: {
          _id: false,
        },
      },
    );
    const realHistory = await delegatedRealCol.findOne(
      {
        delegator: delegatorAddress.toLowerCase(),
      },
      {
        projection: {
          _id: false,
        },
      },
    );
    let allHistory = []
    if(mockHistory){
      allHistory.push(...mockHistory.histories)
    }
    if(realHistory){
      realHistory.histories = realHistory.histories.map((el: any) => {
        el.fromCoreReal = true
        return el
      })
      allHistory.push(...realHistory.histories)
    }
    allHistory = allHistory?.reverse()
    const restakeHistory = await restakeCol.find(
      {
        stakerAddress: delegatorAddress.toLowerCase(),
      },
      {
        projection: {
          _id: false,
        },
      },
    ).toArray();
    const hashmap : any = {}
    restakeHistory.forEach((el: any) => {
      hashmap[el["bitcoinTxId"]] = true
    })
    allHistory = allHistory.filter((el: any) => !hashmap[el["bitcoinTxId"]])
    
    return response(allHistory);
  } catch (error) {
    console.error(error);
    return errorResponse()
  }
}
