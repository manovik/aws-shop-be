import { Sneaker } from 'src/types/types';
import { Client } from 'pg';
import { dbConfig } from '@app/libs/dbConfig';
import { updateProductSQL } from '@app/sql';
import { logger } from '@app/utils/logger';
import { cutId } from '@app/utils/cutId';

const productErrorText = 'Product was not added to database!';

export const PG_updateProduct = async ({
  id,
  count,
  img,
  price,
  description,
  title,
}: Sneaker): Promise<string | unknown> => {
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
    typeof title !== 'string' ||
    !id ||
    typeof id !== 'string'
  ) {
    logger.info(
      `${ productErrorText }`,
      {
        passedParams: {
          id,
          count,
          img,
          price,
          description,
          title,
        },
        passedParamsTypes: {
          id: typeof id,
          count: typeof count,
          img: typeof img,
          price: typeof price,
          description: typeof description,
          title: typeof title,
        },
      },
    );
    logger.info('One of values was not provided or it\'s type didn\'t pass validation.');
  }

  const client = new Client(dbConfig);
  try {
    logger.info('Trying to connect to DB');
    await client.connect();
    
    logger.info('Connected to database');

    await client.query('BEGIN');
    await client.query(updateProductSQL.upd_Products(), [title, description, price, id]);
    logger.info(`${ cutId(id) } was updated in Products table`);

    await client.query(updateProductSQL.upd_Stocks(), [count, id]);
    logger.info(`${ cutId(id) } was updated in Stocks table`);

    await client.query(updateProductSQL.upd_Images(), [img, id]);
    logger.info(`${ cutId(id) } was updated in Images table`);

    await client.query('COMMIT');
    logger.info(`${ cutId(id) } was updated`);
    return id;
  } catch (err: unknown) {
    logger.info(
      err,
      '#75 ###### Something went wrong with database!\n',
    );
    return err;
  } finally {
    client.end();
  }
};
