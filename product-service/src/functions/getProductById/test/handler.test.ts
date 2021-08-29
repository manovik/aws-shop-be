import { handler } from '../handler';
import { getAllProducts } from '@libs/getAllProducts';

const notFoundResponseExample = {
  statusCode: 404,
  body: 'Product not found',
};

const serverErrorResponseExample = {
  statusCode: 500,
  body: 'Something went wrong on the server.\nTry again later.',
};

const createEvent = (flag: boolean = true): any => ({
  body: 'string',
  headers: { 'Some-header': 'go' },
  httpMethod: 'get',
  isBase64Encoded: true,
  path: 'string',
  pathParameters: { id: flag ? 'SB-CT1972-006' : 'SB-H0425' },
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: null,
  resource: 'string',
});

const mockRightResponse = {
  statusCode: 200,
  body: {
    product: [
      {
        count: 10,
        id: 'SB-CT1972-006',
        img: 'https://sneakers.by/image/cache/data/1C-1/SB-CT1972-006-300x300.webp',
        price: 299,
        description: 'Nike Kyrie FlyTrap IV (CT1972-006)',
        title: 'Nike Kyrie FlyTrap IV',
      },
    ],
  },
};

jest.mock('@libs/getAllProducts', () => {
  const mockSneakers = require('@app/mock/sneakersMock.json');

  return {
    getAllProducts: jest.fn().mockReturnValue(mockSneakers),
  };
});

describe('Testing getProductById function', () => {
  it('should return "Product not found"', async () => {
    let response = await handler(createEvent(false));
    expect(response.body).toEqual(notFoundResponseExample.body);
  });
  it('should return 404', async () => {
    let response = await handler(createEvent(false));
    expect(response.statusCode).toEqual(notFoundResponseExample.statusCode);
  });
  it('should return right ID', async () => {
    let response = await handler(createEvent());
    expect(response.body).toEqual(JSON.stringify(mockRightResponse.body));
  });
  it('should return 500', async () => {
    jest.fn(getAllProducts).mockRejectedValue([]);
    let response = await handler({} as any);
    expect(response.statusCode).toEqual(serverErrorResponseExample.statusCode);
    expect(response.body).toEqual(serverErrorResponseExample.body);
  });
});
