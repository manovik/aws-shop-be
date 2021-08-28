import 'source-map-support/register';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { FormatJSONResponseType, Sneaker } from '@app/types/types';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getAllProducts } from '@libs/getAllProducts';
import { find } from '@libs/find';

export const handler = async (event: APIGatewayProxyEvent): Promise<FormatJSONResponseType> => {
  try {
    const { id } = event.pathParameters;
    const sneakers: Sneaker[] = await getAllProducts();
    const product: Sneaker = find(sneakers, id);
    
    return formatJSONResponse({
      statusCode: product ? 200 : 404,
      product: product ? [ product ] : []
    });
  } catch (err) {
    console.error(
      '### Something went wrong!\n',
      err,
      '\n#########################'
    );
    return formatJSONResponse({
      statusCode: 500,
      product: []
    });
  }
}

export const getProductById = middyfy(handler);
