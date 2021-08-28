import { handler } from '../handler'

const badResponseExample = {
  statusCode: 404,
  body: "Product not found"
}

const createEvent = (flag: boolean = true): any => ({
  body: 'string',
  headers: {'Some-header': 'go'},
  httpMethod: 'get',
  isBase64Encoded: true,
  path: 'string',
  pathParameters: { id: flag ? "SB-FY4975" : "SB-H0425" },
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: null,
  resource: 'string',
})

const mockRightResponse = {
  statusCode: 200,
  body: {
    product: [{
      count: 10,
      id: "SB-FY4975",
      img: "https://sneakers.by/image/cache/data/1C-1/SB-FY4975-300x300.webp",
      price: 329,
      description: "Adidas Forum Mid (FY4975)",
      title: "Adidas Forum Mid"
    }]
  },
}

describe('Testing getProductById function', () => {
  it('should return "Product not found"', async () => {
    let response = await handler(createEvent(false));
    expect(response.body).toEqual(badResponseExample.body)
  })
  it('should return 404', async () => {
    let response = await handler(createEvent(false));
    expect(response.statusCode).toEqual(badResponseExample.statusCode)
  })
  it('should return right ID', async () => {
    let response = await handler(createEvent());
    expect(response.body).toEqual(JSON.stringify(mockRightResponse.body));
  })
})
