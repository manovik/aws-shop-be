import 'source-map-support/register';
import { SNS } from 'aws-sdk';
import { GLOBAL_INFO } from '@app/constants';
import { SQSEvent } from 'aws-lambda';
import { logger } from '@app/utils/logger';

export const catalogBatchProcess = async (event: SQSEvent): Promise<void> => {
  const sns = new SNS({ region: GLOBAL_INFO.REGION });
  const products = event.Records.map(({ body }) => body);
  const jsonProducts = JSON.stringify(products);
  logger.info(jsonProducts);
  try {
    await sns.publish({
      Subject: 'Hello from catalogBatchProcess lambda!',
      Message: jsonProducts,
      TopicArn: process.env.SNS_ARN,
    }, (err: unknown) => {
      if (err) {
        logger.info(
          err,
          'Something went wrong while publishing message.'
        );
      }
    }).promise();
    logger.info(`End of publishing to SNS.`);
  } catch (err: unknown) {
    logger.info(
      err,
      'Something went wrong while publishing message.'
    );
  }
}
