import 'source-map-support/register';
import { APIGatewayProxyEvent } from 'aws-lambda';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import * as sneakers from '../../mock/sneakers.json';
import { Sneaker } from 'src/types/types';
import { find } from '@libs/find';

const handler = async (event: APIGatewayProxyEvent) => {
  const { id } = event.pathParameters;

  const product: Sneaker | null = find(sneakers, id);

  return formatJSONResponse({
    sneakers: product ? [ product ] : []
  });
}

export const getProductById = middyfy(handler);
