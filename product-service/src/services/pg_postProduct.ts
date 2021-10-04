import { PostSneaker } from 'src/types/types';
import { Client, ClientConfig } from 'pg';
import { postProductSQL } from '@app/sql';
import { logger } from '@app/utils/logger';

const productErrorText = 'Product was not added to database!';

const dbConfig: ClientConfig = {
  host: process.env.PG_HOST,
  port: +process.env.PG_PORT,
  database: process.env.PG_DB,
  user: process.env.PG_USER,
  password: process.env.PG_PASS,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};

export const PG_postProduct = async ({
  count,
  img,
  price,
  description,
  title,
}: PostSneaker): Promise<string | { error: string }> => {
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
        'One of values was not provided or it\'s type doesn\'t passed validation. ' +
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
    await client.query(
      postProductSQL({
        count,
        img,
        price,
        description,
        title,
      })
    );
    await client.query('COMMIT');
    logger.info(`${ title } added to database now`);
      
    return title;
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
