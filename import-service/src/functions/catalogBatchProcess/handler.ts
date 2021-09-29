import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { SNS } from 'aws-sdk';
import { GLOBAL_INFO } from '@app/constants';
import { SQSEvent } from 'aws-lambda';

const handler = async (event: SQSEvent) => {
  const sns = new SNS({ region: GLOBAL_INFO.REGION });
  const products = event.Records.map(({ body }) => body);
  console.log(event);
  
  try {
    sns.publish({
      Subject: 'Hello from catalogBatchProcess lambda!',
      Message: JSON.stringify(products),
      TopicArn: process.env.SNS_ARN,
    }, (err: unknown) => {
      console.error('Something went wrong while publishing message.', err);
    })

    return formatJSONResponse({
      response: event,
      statusCode: 200
    });
  } catch (err: any) {
    return formatJSONResponse({
      response: err,
      statusCode: 500
    });
  }
}

export const catalogBatchProcess = middyfy(handler);
