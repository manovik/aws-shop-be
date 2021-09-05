import { Sneaker } from 'src/types/types';
import { Client } from 'pg';
import { dbConfig } from '@app/libs/dbConfig';
import { getAllProductsSQL } from '@app/sql';
import { logger } from '@app/utils/logger';

export const PG_getAllProducts = async (): Promise<Sneaker[]> => {
  const client = new Client(dbConfig);
  await client.connect();

  try {
    const { rows }: { rows: Sneaker[] } = await client.query(getAllProductsSQL());

    return rows;
  } catch (error: unknown) {
    logger.info({
      msg: '#17 ###### Something went wrong while getting all products!',
      error
    });
  } finally {
    client.end();
  }
};
