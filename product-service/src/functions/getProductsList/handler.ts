import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { PG_getAllProducts } from '@app/services/pg_getAllProducts';
import { FormatJSONResponseType, Sneaker } from '@app/types/types';
import { STATUS } from '@app/constants';

export const handler = async (): Promise<FormatJSONResponseType> => {
  try {
    const product: Sneaker[] = await PG_getAllProducts();

    if (!product || product.length === 0) {
      return formatJSONResponse({
        statusCode: STATUS.SERV_ERR,
        product: [],
      });
    }

    return formatJSONResponse({
      statusCode: STATUS.SUCCESS,
      product,
    });
  } catch (err: unknown) {
    console.error(
      '#26 ###### Something went wrong!\n',
      err,
      '\n#############################'
    );
    return formatJSONResponse({
      statusCode: STATUS.SERV_ERR,
      product: [],
    });
  }
};

export const getProductsList = middyfy(handler);
