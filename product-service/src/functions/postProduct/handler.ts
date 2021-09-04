import 'source-map-support/register';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { FormatJSONResponseType } from '@app/types/types';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { PG_postProduct } from '@app/services/pg_postProduct';
import { STATUS } from '@app/constants';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<FormatJSONResponseType> => {
  try {
    const { postProduct } = event.body as any;
    const result = await PG_postProduct(postProduct);

    return formatJSONResponse({
      statusCode: STATUS.SUCCESS,
      message: `Product with id ${result} successfuly added to database`,
    });
  } catch (err) {
    console.error(
      '### Something went wrong!\n',
      err,
      '\n#########################'
    );
    return formatJSONResponse({
      statusCode: STATUS.SERV_ERR,
      message: 'Something went wrong. There might be a problem with database.',
    });
  }
};

export const postProduct = middyfy(handler);
