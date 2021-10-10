import 'source-map-support/register';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { FormatJSONResponseType } from '@app/types/types';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { pg_markProductAsDeleted } from '@app/services/pg_markProductAsDeleted';
import { STATUS } from '@app/constants';
import { logger } from '@app/utils/logger';
import { cutId } from '@app/utils/cutId';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<FormatJSONResponseType> => {
  const { id } = event.pathParameters;
  const hash = cutId(id);
  try {
    await pg_markProductAsDeleted(id);

    return formatJSONResponse({
      statusCode: STATUS.DELETED,
      message: `Product with id ${ hash } successfully deleted`,
    });

  } catch (err: unknown) {
    logger.info(
      err,
      `Something went wrong!\nFailed to delete product by id "${ hash }"!`,
    );

    return formatJSONResponse({
      statusCode: STATUS.INVALID,
      message: 'Something went wrong. There might be a problem with id you\'ve passed.',
    });
  }
};

export const deleteProduct = middyfy(handler);
