import { FormatJSONResponseType } from '@app/types/types';
import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { APIGatewayProxyEvent } from 'aws-lambda';

export const middyfy = (handler: (event: APIGatewayProxyEvent) => Promise<FormatJSONResponseType>): middy.Middy<unknown, unknown> => {
  return middy(handler).use(middyJsonBodyParser());
};
