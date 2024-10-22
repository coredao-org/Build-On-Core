import { getMongoDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { RestakeModel } from '@/types/model';
import { WithId } from 'mongodb';
import { errorResponse, response } from '@/utils/common';

const perPage = 100;

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    let { validatorAddress, stakerAddress } = body;
    if (!validatorAddress && !stakerAddress) {
      return response(
        {
          error: 'Missing validatorAddress, stakerAddress. Required 1',
        },
        400,
      );
    }
    validatorAddress = validatorAddress ? validatorAddress.toLowerCase() : null;
    stakerAddress = stakerAddress ? stakerAddress.toLowerCase() : null;
    const db = await getMongoDb();
    const restakeHistoryCol = db.collection('restake_history');
    const page = req.nextUrl.searchParams.get('page') ?? 1;

    
    
    const query = {} as any;

    if (validatorAddress) {
      query.validatorAddress = validatorAddress;
    } else {
      query.stakerAddress = stakerAddress;
    }
    const totalCount = await restakeHistoryCol.countDocuments(query);
    const totalPage = Math.ceil(totalCount / perPage);

    const result = (await restakeHistoryCol
      .find(query, {
        projection: {
          _id: false,
        },
      })
      .skip((+page - 1) * perPage)
      .limit(perPage)
      .toArray()).reverse() as WithId<RestakeModel>[];

    if(validatorAddress) {
      let delegatorsCount = await restakeHistoryCol.aggregate([
        {
          $match: { validatorAddress }
        },
        {
          $group: {
            _id: "$stakerAddress"
          }
        },
        {
          $count: "numberOfStakers"
        }
      ]).toArray();
      return response({
        data: result,
        page: +page,
        totalPage: +totalPage,
        totalCount: +totalCount,
        delegatorsCount: delegatorsCount.length ? delegatorsCount[0]['numberOfStakers'] : 0,
      });
    }

    return response({
      data: result,
      page: +page,
      totalPage: +totalPage,
      totalCount: +totalCount,
    });
  } catch (error) {
    console.error(error);
    return errorResponse();
  }
}
