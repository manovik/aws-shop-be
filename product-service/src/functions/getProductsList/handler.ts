import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { PG_getAllProducts } from '@app/services/pg_getAllProducts';
import { FormatJSONResponseType, Sneaker } from '@app/types/types';
import { STATUS } from '@app/constants';
import { logger } from '@app/utils/logger';

export const handler = async (): Promise<FormatJSONResponseType> => {
  try {
    const product: Sneaker[] = await PG_getAllProducts();

    if (!product || product.length === 0) {
      return formatJSONResponse({
        statusCode: STATUS.SERV_ERR,
        product: [],
      });
    }
    logger.info('Getting product list.');
    return formatJSONResponse({
      statusCode: STATUS.SUCCESS,
      product,
    });
  } catch (err: unknown) {
    logger.info(
      err,
      '#28 ###### Something went wrong while getting product list!',
    );
    return formatJSONResponse({
      statusCode: STATUS.SERV_ERR,
      product: [],
    });
  }
};

export const getProductsList = middyfy(handler);
