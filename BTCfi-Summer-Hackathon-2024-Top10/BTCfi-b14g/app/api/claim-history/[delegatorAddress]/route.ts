import { getMongoDb } from '@/lib/db';
import { errorResponse, response } from '@/utils/common';
import { NextRequest } from 'next/server';

const perPage = 100000;

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
    if (!delegatorAddress) return response({ error: 'Missing address' }, 400);
    delegatorAddress = delegatorAddress.toString();
    const page = req.nextUrl.searchParams.get('page') ?? 1;
    const db = await getMongoDb();
    const claimHistoryCol = db.collection('claim_history');
    const query = { delegatorAddress };

    const totalCount = await claimHistoryCol.countDocuments(query);
    const totalPage = Math.ceil(totalCount / perPage);

    const result = await claimHistoryCol
      .find(query)
      .skip((+page - 1) * perPage)
      .limit(perPage)
      .toArray();
    return response({
      data: result,
      totalPage,
      page,
      totalCount,
    });
  } catch (error) {
    console.error(error);
    return errorResponse();
  }
}
