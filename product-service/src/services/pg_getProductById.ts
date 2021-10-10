import { Sneaker } from 'src/types/types';
import { Client } from 'pg';
import { dbConfig } from '@app/libs/dbConfig';
import { getProductByIdSQL } from '@app/sql';
import { logger } from '@app/utils/logger';

export const PG_getProductById = async (id: string): Promise<Sneaker[]> => {
  const client = new Client(dbConfig);
  await client.connect();

  try {
    const { rows } = await client.query<Sneaker>(
      getProductByIdSQL(id)
    );

    return rows;
  } catch (err: unknown) {
    logger.info(
      err,
      '#20 ###### Something went wrong while getting product by Id!',
    );
  } finally {
    client.end();
  }
};
