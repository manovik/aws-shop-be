import { Sneaker } from '@app/types/types';
import * as getAllProducts from '@app/services/pg_getAllProducts';
import { handler } from '../handler';

import mockSneakers from '@app/mock/sneakersMock.json';
import { STATUS } from '@app/constants';

const serverErrorResponseExample = {
  statusCode: STATUS.SERV_ERR,
  body: {
    message: 'Something went wrong on the server.\nTry again later.',
    product: [] as []
  }
};

describe('Testing getProductsList function', () => {
  it('should return list of products', async () => {
    const numberOfProductsInMock = 36;
    (getAllProducts as any).PG_getAllProducts = jest
      .fn()
      .mockResolvedValue(mockSneakers);
    
    const response = await handler();

    expect(JSON.parse(response.body as string).product).toBeInstanceOf(Array);
    expect(
      (JSON.parse(response.body as string).product as Sneaker[]).length
    ).toBe(numberOfProductsInMock);
  });
  it('should return 500', async () => {
    (getAllProducts as any).PG_getAllProducts = jest.fn().mockReturnValue([]);
    const response = await handler();

    expect(response.statusCode).toEqual(serverErrorResponseExample.statusCode);
    expect(JSON.parse(response.body as string)).toEqual(serverErrorResponseExample.body);
  });
});
