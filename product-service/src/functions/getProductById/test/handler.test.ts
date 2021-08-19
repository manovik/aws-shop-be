const getProductById = require("../handler");

const mockEvent = {
  pathParameters: {
    id: "SB-H0425"
  }
}

const mockResponse = {
  statusCode: 404,
  headers: {
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*"
  },
  body: "Product not found"
}


describe('Testing getProductById function', () => {
  it('should return 404',  () => {
    let response = getProductById(mockEvent, null, jest.fn())
    expect(response).toEqual(mockResponse)
  })
  // it('should be called', () => {

  // })
})