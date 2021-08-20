import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { sneakers } from '../../mock/sneakers' 

const handler = async () => {

  return formatJSONResponse({
    sneakers
  });
}

export const getProductsList = middyfy(handler);
