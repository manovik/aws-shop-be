import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { SNS } from 'aws-sdk';
import { GLOBAL_INFO, STATUS } from '@app/constants';
import { SQSEvent } from 'aws-lambda';
import { logger } from '@app/utils/logger';

const handler = async (event: SQSEvent) => {
  const sns = new SNS({ region: GLOBAL_INFO.REGION });
  const products = event.Records.map(({ body }) => body);
  logger.info({ msg: products });
  
  try {
    sns.publish({
      Subject: 'Hello from catalogBatchProcess lambda!',
      Message: JSON.stringify(products),
      TopicArn: process.env.SNS_ARN,
    }, (err: unknown) => {
      if (err) {
        logger.info({
          msg: 'Something went wrong while publishing message.', 
          err
        });
      }
      
    })

    return formatJSONResponse({
      response: event,
      statusCode: STATUS.SUCCESS
    });
  } catch (err: any) {
    return formatJSONResponse({
      response: err,
      statusCode: STATUS.SERV_ERR
    });
  }
}

export const catalogBatchProcess = middyfy(handler);
