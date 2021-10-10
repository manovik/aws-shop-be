import { Sneaker } from 'src/types/types';
import { Client } from 'pg';
import { dbConfig } from '@app/libs/dbConfig';
import { getAllProductsSQL } from '@app/sql';
import { logger } from '@app/utils/logger';

export const PG_getAllProducts = async (): Promise<Sneaker[]> => {
  const client = new Client(dbConfig);
  await client.connect();

  try {
    const { rows } = await client.query<Sneaker>(getAllProductsSQL());

    return rows;
  } catch (err: unknown) {
    logger.info(
      err,
      '#18 ###### Something went wrong while getting all products!',
    );
  } finally {
    client.end();
  }
};
