import { handler } from '../handler';
import * as getById from '@app/services/PG_getProductById';
import { STATUS } from '@app/constants';
import mockSneakers from '@app/mock/sneakersMock.json';

const notFoundResponseExample = {
  statusCode: STATUS.NOT_FOUND,
  body: {
    message: 'Product not found',
    product: [],
  },
};

const serverErrorResponseExample = {
  statusCode: STATUS.SERV_ERR,
  body: {
    message: 'Something went wrong on the server.\nTry again later.',
    product: []
  }
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
  statusCode: STATUS.SUCCESS,
  body: {
    message: 'OK!',
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

describe('Testing getProductById function', () => {
  it('should return "Product not found"', async () => {
    (getById as any).PG_getProductById = jest.fn().mockResolvedValue(null);
    let response = await handler(createEvent(false));
    expect(JSON.parse(response.body as string).message).toEqual(notFoundResponseExample.body.message);
  });
  it('should return 404', async () => {
    let response = await handler(createEvent(false));
    expect(response.statusCode).toEqual(notFoundResponseExample.statusCode);
  });
  it('should return right ID', async () => {
    (getById as any).PG_getProductById = jest.fn().mockResolvedValue([mockSneakers[6]]);
    let response = await handler(createEvent());
    expect(JSON.parse(response.body as string)).toEqual(mockRightResponse.body);
  });
  it('should return 500', async () => {
    (getById as any).PG_getProductById = jest.fn().mockRejectedValue([]);
    let response = await handler({} as any);
    expect(response.statusCode).toEqual(serverErrorResponseExample.statusCode);
    expect(JSON.parse(response.body as string)).toEqual(serverErrorResponseExample.body);
  });
});
