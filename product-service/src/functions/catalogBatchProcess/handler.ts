import 'source-map-support/register';
import { SNS } from 'aws-sdk';
import { GLOBAL_INFO } from '@app/constants';
import { SQSEvent } from 'aws-lambda';
import { logger } from '@app/utils/logger';
import { PG_postProduct } from '@app/services/pg_postProduct';
import { PostSneaker } from '@app/types/types';

export const catalogBatchProcess = async (event: SQSEvent): Promise<void> => {
  const sns = new SNS({ region: GLOBAL_INFO.REGION });
  const products: PostSneaker[] = event.Records.map(({ body }) => JSON.parse(body));
  for (const product of products) {
    try {
      const { title, description, price, img, count } = product;

      logger.info({
        count: +count,
        img,
        price: +price,
        description,
        title,
      });
      
      const res = await PG_postProduct({
        count: +count,
        img,
        price: +price,
        description,
        title
      });

      logger.info(`End of posting ${ res }!`);
      
      if (typeof res !== 'string') {
        logger.info({
          res
        });
        throw Error(res.error);
      }

      const snsOpts = (prods: PostSneaker): SNS.PublishInput => ({
        Subject: 'Hello from catalogBatchProcess lambda!',
        Message: JSON.stringify(prods),
        TopicArn: process.env.SNS_ARN,
        MessageAttributes: {
          price: {
            DataType: 'Number',
            StringValue: prods.price.toString()
          },
        },
      });

      await sns.publish(snsOpts(product)).promise();
    } catch (err: unknown) {
      logger.info(
        err,
        'Something went wrong while publishing message.'
      );
    }
  }
};
