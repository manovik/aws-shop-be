import { STATUS } from '@app/constants';
import { FormatJSONResponseType, ResponseType } from '@app/types/types';
import { messageCreator } from './messageCreator';

const headers = {
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
};

export const formatJSONResponse = (
  response: ResponseType
): FormatJSONResponseType => {
  const { statusCode, product, message } = response;

  switch (statusCode) {
  case STATUS.SUCCESS:
    return {
      statusCode: STATUS.SUCCESS,
      headers,
      body: JSON.stringify({
        product,
        message: (
          message
            ? message
            : messageCreator(STATUS.SUCCESS)
        )
      }),
    };
  case STATUS.NOT_FOUND:
    return {
      statusCode: STATUS.NOT_FOUND,
      headers,
      body: JSON.stringify({
        product,
        message: (
          message
            ? message
            : messageCreator(STATUS.NOT_FOUND)
        )
      })
    };
  case STATUS.SERV_ERR:
    return {
      statusCode: STATUS.SERV_ERR,
      headers,
      body: JSON.stringify({
        product,
        message: (
          message
            ? message
            : messageCreator(STATUS.SERV_ERR)
        )
      })
    };
  default:
    return {
      statusCode: STATUS.INVALID,
      headers,
      body: JSON.stringify({
        product: [],
        message: (
          message
            ? message
            : messageCreator(STATUS.INVALID)
        )
      })
    };
  }
};
