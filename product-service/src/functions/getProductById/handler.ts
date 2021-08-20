import 'source-map-support/register';
// import { APIGatewayProxyEvent } from 'aws-lambda';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { sneakers } from '../../mock/sneakers';
import { Sneaker } from 'src/types/types';
import { find } from '@libs/find';

export const handler = async (event) => {
  
  const { id } = event.pathParameters;
  
  const product: Sneaker | null = find(sneakers, id);

  return formatJSONResponse({
    sneakers: product ? [ product ] : []
  });
}

export const getProductById = middyfy(handler);
