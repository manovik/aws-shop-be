import 'source-map-support/register';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { FormatJSONResponseType, PostSneaker } from '@app/types/types';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { PG_postProduct } from '@app/services/pg_postProduct';
import { STATUS } from '@app/constants';
import { logger } from '@app/utils/logger';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<FormatJSONResponseType> => {
  try {
    const { postProduct }: { postProduct: PostSneaker } = JSON.parse(event.body);
    const result = await PG_postProduct(postProduct);

    if (typeof result === 'string') {
      logger.info('Posted new product!');
      return formatJSONResponse({
        statusCode: STATUS.SUCCESS,
        message: 'Product successfully added to database',
      });
    }

    const { error } = result as { error: string };

    logger.info(
      { err: error },
      'Failed to post new product!',
    );

    return formatJSONResponse({
      statusCode: STATUS.INVALID,
      message: error,
    });
  } catch (err: unknown) {
    logger.info(
      err,
      '#40 ###### Something went wrong!\nFailed to post new product!',
    );

    return formatJSONResponse({
      statusCode: STATUS.SERV_ERR,
      message: 'Something went wrong. There might be a problem with database.',
    });
  }
};

export const postProduct = middyfy(handler);
