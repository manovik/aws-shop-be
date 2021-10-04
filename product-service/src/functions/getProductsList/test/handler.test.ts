import { Sneaker } from '@app/types/types';
import * as getAllProducts from '@libs/getAllProducts';
import { handler } from '../handler';

import mockSneakers from '@app/mock/sneakersMock.json';

const serverErrorResponseExample = {
  statusCode: 500,
  body: 'Something went wrong on the server.\nTry again later.',
};

describe('Testing getProductsList function', () => {
  it('should return list of products', async () => {
    const numberOfProductsInMock = 36;
    (getAllProducts as any).getAllProducts = jest
      .fn()
      .mockReturnValue(mockSneakers);

    let response = await handler();

    expect(JSON.parse(response.body as string).product).toBeInstanceOf(Array);
    expect(
      (JSON.parse(response.body as string).product as Sneaker[]).length
    ).toBe(numberOfProductsInMock);
  });
  it('should return 500', async () => {
    (getAllProducts as any).getAllProducts = jest.fn().mockReturnValue([]);
    let response = await handler();
    console.log(
      '🚀 ~ file: handler.test.ts ~ line 59 ~ it ~ response\n',
      response
    );
    expect(response.statusCode).toEqual(serverErrorResponseExample.statusCode);
    expect(response.body).toEqual(serverErrorResponseExample.body);
  });
});
