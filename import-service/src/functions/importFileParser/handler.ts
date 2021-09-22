import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { S3 } from 'aws-sdk';
import { GLOBAL_INFO } from '@app/constants';
import { S3Event } from 'aws-lambda';
import * as csv from 'csv-parser';

const handler = async (event: S3Event) => {
  const s3 = new S3({ region: GLOBAL_INFO.REGION });
  const result = [];

  try {
    for (let record of event.Records) {
      const { key } = record.s3.object;
      console.log(`Start reading '${key}' from bucket '${GLOBAL_INFO.CSV_BUCKET}'`)
      await new Promise((res, rej): void => {
        const readableStream = s3.getObject({ Bucket: GLOBAL_INFO.CSV_BUCKET, Key: key }).createReadStream();
        readableStream
          .pipe(csv())
          .on('data', (data) => {
            result.push(data);
            console.log('CSV Parser did it --->', data);
          })
          .on('err', (err) => {
            console.error(`Error occurred while reading data from bucket '${GLOBAL_INFO.CSV_BUCKET}'. ${err}`);
            rej(err);
          })
          .on('end', () => {
            console.log(`End of reading '${key}' from bucket '${GLOBAL_INFO.CSV_BUCKET}'`);
            res('');
          })
      })
    }

    return formatJSONResponse({
      statusCode: 200,
      response: result,
    });
  } catch (err: any) {
    return formatJSONResponse({
      response: err,
      statusCode: 500,
    });
  }
}

export const importFileParser = middyfy(handler);
