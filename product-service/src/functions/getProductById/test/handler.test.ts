import { handler } from '../handler'

const mockBadEvent = {
  pathParameters: {
    id: "SB-H0425"
  }
}

const mockBadResponse = {
  statusCode: 404,
  body: "Product not found"
}

const mockRightEvent = {
  pathParameters: {
    id: "SB-FY4975"
  }
}

const mockRightResponse = {
  statusCode: 200,
  body: {
    sneakers: [{
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
    let response = await handler(mockBadEvent);
    expect(response.body).toEqual(mockBadResponse.body)
  })
  it('should return 404', async () => {
    let response = await handler(mockBadEvent);
    expect(response.statusCode).toEqual(mockBadResponse.statusCode)
  })
  it('should return right ID', async () => {
    let response = await handler(mockRightEvent);
    expect(response.body).toEqual(mockRightResponse.body);
  })
})
