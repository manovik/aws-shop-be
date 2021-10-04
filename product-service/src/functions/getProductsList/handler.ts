import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getAllProducts } from '@libs/getAllProducts';
import { FormatJSONResponseType, Sneaker } from '@app/types/types';

export const handler = async (): Promise<FormatJSONResponseType> => {
  try {
    const product: Sneaker[] = await getAllProducts();

    if(!product || product.length === 0) {
      return formatJSONResponse({
        statusCode: 500,
        product: [],
      });
    }

    return formatJSONResponse({
      statusCode: 200,
      product,
    });
  } catch (err) {
    console.error(
      '#18 ###### Something went wrong!\n',
      err,
      '\n#############################'
      );
    return formatJSONResponse({
      statusCode: 500,
      product: [],
    });
  }
};

export const getProductsList = middyfy(handler);
