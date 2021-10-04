import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { S3, SQS } from 'aws-sdk';
import { GLOBAL_INFO } from '@app/constants';
import { S3Event } from 'aws-lambda';
import * as csv from 'csv-parser';
import { logger } from '@app/utils/logger';

const handler = async (event: S3Event) => {
  const s3 = new S3({ region: GLOBAL_INFO.REGION });

  try {
    for (const record of event.Records) {
      const sqs = new SQS();
      const {key} = record.s3.object;

      logger.info(`Start reading '${ key }' from bucket '${ GLOBAL_INFO.CSV_BUCKET }'`);

      await new Promise((
        res: (value: unknown) => void,
        rej: (error?: Error) => void
      ): void => {
        const readableStream = s3.getObject({ Bucket: GLOBAL_INFO.CSV_BUCKET, Key: key }).createReadStream();
        
        readableStream
          .pipe(csv())
          .on('data', (data: Record<string, unknown>) => {
            const jsonData = JSON.stringify(data);

            sqs.sendMessage({
              QueueUrl: process.env.SQS_URL,
              MessageBody: jsonData,
            }, (err) => {
              if (err) {
                logger.info(err, 'Error occurred while sending message to SQS.');
                rej(err);
              }
            });
            logger.info(`End of sending data:\n${ jsonData }`);
          })
          .on('err', (err: Error) => {
            logger.info(err, `Error occurred while reading data from bucket '${ GLOBAL_INFO.CSV_BUCKET }'.`);
            rej(err);
          })
          .on('end', async () => {
            logger.info(`End of reading '${ key }' from bucket '${ GLOBAL_INFO.CSV_BUCKET }'`);

            await s3.copyObject({
              Bucket: GLOBAL_INFO.CSV_BUCKET,
              CopySource: `${ GLOBAL_INFO.CSV_BUCKET }/${ key }`,
              Key: key.replace(GLOBAL_INFO.UPLOADED, GLOBAL_INFO.PARSED)
            }).promise();

            await s3.deleteObject({ Bucket: GLOBAL_INFO.CSV_BUCKET, Key: key }).promise();

            logger.info(
              `Object '${ key }' was copied from '${ GLOBAL_INFO.CSV_BUCKET }/${ GLOBAL_INFO.UPLOADED }' to '${ GLOBAL_INFO.CSV_BUCKET }/${ GLOBAL_INFO.PARSED }'`
            );
            res('Success');
          });
      });
    }

    return formatJSONResponse({
      statusCode: 200,
      response: {
        message: 'Data has been sent to SQS.'
      },
    });
  } catch (err: unknown) {
    return formatJSONResponse({
      response: err,
      statusCode: 500,
    });
  }
};

export const importFileParser = middyfy(handler);
