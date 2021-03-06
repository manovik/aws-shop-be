import 'source-map-support/register';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { FormatJSONResponseType, Sneaker } from '@app/types/types';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { STATUS } from '@app/constants';
import { PG_getProductById } from '@app/services/pg_getProductById';
import { logger } from '@app/utils/logger';
import { cutId } from '@app/utils/cutId';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<FormatJSONResponseType> => {
  const { id } = event.pathParameters;
  try {
    const products: Sneaker[] = await PG_getProductById(id);
    
    logger.info(`Getting product with id ${ cutId(id) }`);

    return formatJSONResponse({
      statusCode: products?.length ? STATUS.SUCCESS : STATUS.NOT_FOUND,
      product: products?.length ? products : [],
    });
  } catch (err: unknown) {
    logger.info(
      err,
      `#27 ###### Something went wrong! Failed to get product with id ${ cutId(id) }`,
    );
    return formatJSONResponse({
      statusCode: STATUS.SERV_ERR,
      product: [],
    });
  }
};

export const getProductById = middyfy(handler);
