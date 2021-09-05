import { STATUS } from "@app/constants"

export const messageCreator = (status: STATUS): string => {
  const messages = {
    [STATUS.SUCCESS]: 'OK!',
    [STATUS.SERV_ERR]: 'Something went wrong on the server.\nTry again later.',
    [STATUS.NOT_FOUND]: 'Product not found',
    [STATUS.INVALID]: 'Unhandled status code error.\nHere is the default body. Try again later.',
  }
  return messages[status];
}