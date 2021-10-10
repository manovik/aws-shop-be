import { PostSneaker, Sneaker } from 'src/types/types';
import { Client } from 'pg';
import { dbConfig } from '@app/libs/dbConfig';
import { postProductSQL } from '@app/sql';
import { logger } from '@app/utils/logger';

const productErrorText = 'Product was not added to database!';

export const PG_postProduct = async ({
  count,
  img,
  price,
  description,
  title,
}: PostSneaker): Promise<string | Record<string, string> | { error: string }> => {
  if (
    !count ||
    typeof count !== 'number' ||
    count < 1 ||
    !img ||
    typeof img !== 'string' ||
    !price ||
    typeof price !== 'number' ||
    !description ||
    typeof description !== 'string' ||
    !title ||
    typeof title !== 'string'
  ) {
    logger.info(
      `#30 ###### ${ productErrorText }`,
      {
        passedParams: {
          count,
          img,
          price,
          description,
          title,
        },
        passedParamsTypes: {
          count: typeof count,
          img: typeof img,
          price: typeof price,
          description: typeof description,
          title: typeof title,
        },
      },
    );
    return {
      error:
        'One of values was not provided or it\'s type didn\'t pass validation. ' +
        productErrorText,
    };
  }

  logger.info(dbConfig);
  let client;
  try {
    client = new Client(dbConfig);
    logger.info('Trying to connect to DB');
    await client.connect();
    
    logger.info('Connected to database');

    await client.query('BEGIN');
    const { rows } = await client.query<Pick<Sneaker, 'id'>>(
      postProductSQL(),
      [
        title,
        description,
        price,
        count,
        img,
      ]
    );
    const [{ id }] = rows;
    await client.query('COMMIT');
    logger.info(`${ id } added to database now`);
    
    return id;
  } catch (err: unknown) {
    logger.info(
      err,
      '#75 ###### Something went wrong with database!\n',
    );
    return {
      error: productErrorText,
    };
  } finally {
    client.end();
  }
};
