import { getMongoDb } from '@/lib/db';
import { errorResponse, response } from '@/utils/common';
import { NextRequest } from 'next/server';
export const revalidate = 0;
export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      validatorAddress: string;
    };
  },
) {
  try {
    let { validatorAddress } = params;
    if (!validatorAddress) return response({ error: 'Missing address' }, 400);
    validatorAddress = validatorAddress.toString();
    const db = await getMongoDb();
    const validatorCol = db.collection("validator")
    const validator = await validatorCol.findOne({
      validatorAddress
    }) as unknown as {
      btcAmount: string,
      coreAmount: string
    }
  
    return response({
      data: {
        currentCoreAmount: validator.coreAmount,
        currentBtcAmount: validator.btcAmount,
      },
    });
  } catch (error) {
    console.error(error);
    return errorResponse();
  }
}
