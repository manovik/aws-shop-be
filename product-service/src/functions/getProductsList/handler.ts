import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getAllProducts } from '@libs/getAllProducts';
import { FormatJSONResponseType, Sneaker } from '@app/types/types';

const handler = async (): Promise<FormatJSONResponseType> => {
  try {
    const product: Sneaker[] = await getAllProducts();

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
  }
};

export const getProductsList = middyfy(handler);
