import { Sneaker } from 'src/types/types';
import { Client } from 'pg';
import { dbConfig } from '@app/libs/dbConfig';
import { getProductByIdSQL } from '@app/sql';
import { logger } from '@app/utils/logger';

export const PG_getProductById = async (id: string): Promise<Sneaker[]> => {
  const client = new Client(dbConfig);
  await client.connect();

  try {
    const { rows }: { rows: Sneaker[] } = await client.query(
      getProductByIdSQL(id)
    );

    return rows;
  } catch (error: unknown) {
    logger.info({
      msg: '#19 ###### Something went wrong while getting product by Id!',
      error
    });
  } finally {
    client.end();
  }
};
