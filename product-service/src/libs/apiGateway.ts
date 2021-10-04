import { STATUS } from '@app/constants';
import { FormatJSONResponseType, ResponseType } from '@app/types/types';

const headers = {
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
};

export const formatJSONResponse = (
  response: ResponseType
): FormatJSONResponseType => {
  const { statusCode, product } = response;

  switch (statusCode) {
    case STATUS.SUCCESS:
      return {
        statusCode: STATUS.SUCCESS,
        headers,
        body: JSON.stringify({ product }),
      };
    case STATUS.NOT_FOUND:
      return {
        statusCode: STATUS.NOT_FOUND,
        headers,
        body: 'Product not found',
      };
    case STATUS.SERV_ERR:
      return {
        statusCode: STATUS.SERV_ERR,
        headers,
        body: 'Something went wrong on the server.\nTry again later.',
      };
    default:
      return {
        statusCode: STATUS.NOT_FOUND,
        headers,
        body: 'Unhandled status code error.\nHere is the default body. Try again later.',
      };
  }
};
