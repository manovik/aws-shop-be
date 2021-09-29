import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { S3, SQS } from 'aws-sdk';
import { GLOBAL_INFO } from '@app/constants';
import { S3Event } from 'aws-lambda';
import * as csv from 'csv-parser';

type Result = Record<string, unknown>[]

const handler = async (event: S3Event) => {
  const s3 = new S3({ region: GLOBAL_INFO.REGION });
  const sqs = new SQS();
  const result: Result = [];

  try {
    for (let record of event.Records) {
      const { key } = record.s3.object;
      console.log(`Start reading '${key}' from bucket '${GLOBAL_INFO.CSV_BUCKET}'`)
      await new Promise((res: (value: unknown) => void, rej: (error?: Error) => void): void => {
        const readableStream = s3.getObject({ Bucket: GLOBAL_INFO.CSV_BUCKET, Key: key }).createReadStream();
        readableStream
          .pipe(csv())
          .on('data', (data: Record<string, unknown>) => {
            sqs.sendMessage({
              QueueUrl: process.env.SQS_URL,
              MessageBody: JSON.stringify(data),
            }, (err) => {
              if (err) console.error(`Error occurred while sending message to SQS: ${err}`);
              result.push(data);
            });
            console.log('After parsing : ', data);
            
          })
          .on('err', (err: Error) => {
            console.error(`Error occurred while reading data from bucket '${GLOBAL_INFO.CSV_BUCKET}'. ${err}`);
            rej(err);
          })
          .on('end', async () => {
            console.log(`End of reading '${key}' from bucket '${GLOBAL_INFO.CSV_BUCKET}'`);
            await s3.copyObject({
              Bucket: GLOBAL_INFO.CSV_BUCKET,
              CopySource: `${GLOBAL_INFO.CSV_BUCKET}/${key}`,
              Key: key.replace(GLOBAL_INFO.UPLOADED, GLOBAL_INFO.PARSED)
            }).promise();

            await s3.deleteObject({
              Bucket: GLOBAL_INFO.CSV_BUCKET,
              Key: key
            }).promise();
          })
      });
    }

    return formatJSONResponse({
      statusCode: 200,
      response: {
        message: 'Array data to be send to SQS.',
        result
      },
    });
  } catch (err: unknown) {
    return formatJSONResponse({
      response: err,
      statusCode: 500,
    });
  }
}

export const importFileParser = middyfy(handler);
