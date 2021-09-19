import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { S3 } from 'aws-sdk';
import { GLOBAL_INFO } from '@app/constants';
import { APIGatewayProxyEvent } from 'aws-lambda';

const handler = async (event: APIGatewayProxyEvent) => {

  const s3 = new S3({region: GLOBAL_INFO.REGION});
  const params: unknown = {
    Bucket: GLOBAL_INFO.CSV_BUCKET,
    Key: 'uploaded/' + event.queryStringParameters.name,
    Expires: 60,
    ContentType: 'text/csv',
  }

  try {
    const link = await s3.getSignedUrlPromise('putObject', params);
    return formatJSONResponse({
      statusCode: 200,
      response: link,
    });
  } catch (err: any) {
    return formatJSONResponse({
      response: err,
      statusCode: 500
    });
  }
}

export const importProductsFile = middyfy(handler);
