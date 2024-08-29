import { getMongoDb } from '@/lib/db';
import { Dashboard, Validator } from '@/types/model';
import { errorResponse, response } from '@/utils/common';
import { WithId } from 'mongodb';
export const revalidate = 0;
export async function GET() {
  try {
    const db = await getMongoDb();
    const validatorColl = db.collection('validator');
    const result = (await validatorColl
      .find(
        {},
        {
          projection: {
            _id: false,
            txHistories: false,
          },
        },
      )
      .toArray()) as WithId<Validator>[];

    let totalCoreAmount = 0,
      totalBtcAmount = 0,
      validatorsCount = result.length;
    result.forEach((el) => {
      totalCoreAmount += Number(el.coreAmount);
      totalBtcAmount += Number(el.btcAmount);
    });

    const dashboardRes: Dashboard = {
      metrics: {
        totalCoreAmount: totalCoreAmount.toString(),
        totalBtcAmount: totalBtcAmount.toString(),
        validatorsCount,
      },
      validators: result,
    };
    return response(dashboardRes);
  } catch (error) {
    console.error(error);
    return errorResponse()
  }
}
