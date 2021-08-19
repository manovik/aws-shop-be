import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import * as sneakers from '../../mock/sneakers.json' 
import { Sneaker } from 'src/types/types';
import { find } from '@libs/find';

const handler = async (event) => {
  const id: string = event.pathParameters.id;
  console.log("🚀 ~ file: handler.ts ~ line 12 ~ handler ~ id", id)

  const product: Sneaker | null = find(sneakers, id);

  
  console.log("🚀 ~ file: handler.ts ~ line 18 ~ handler ~ product", product)
  return formatJSONResponse({
    sneakers: product ? [ product ] : []
  });
}

export const getProductById = middyfy(handler);
