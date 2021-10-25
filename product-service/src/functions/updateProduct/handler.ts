import 'source-map-support/register';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { FormatJSONResponseType, Sneaker } from '@app/types/types';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { PG_updateProduct } from '@app/services/pg_updateProduct';
import { STATUS } from '@app/constants';
import { logger } from '@app/utils/logger';
import { cutId } from '@app/utils/cutId';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<FormatJSONResponseType> => {
  try {
    const { updateProduct }: Record<string, Sneaker> = event.body as any;
    const result = await PG_updateProduct(updateProduct);

    if (typeof result === 'string') {
      logger.info('Updated product!');
      return formatJSONResponse({
        statusCode: STATUS.SUCCESS,
        message: `Product with id ${ cutId(result) } successfully updated`,
      });
    } else {
      const message = `Failed to update product with id ${ cutId( updateProduct.id ) }`;
      logger.info(message);
      return formatJSONResponse({
        statusCode: STATUS.INVALID,
        message,
      });
    }
  } catch (err: unknown) {
    logger.info(
      err,
      '#40 ###### Something went wrong!\nFailed to update new product!',
    );

    return formatJSONResponse({
      statusCode: STATUS.SERV_ERR,
      message: 'Something went wrong. There might be a problem with database.',
    });
  }
};

export const updateProduct = middyfy(handler);
