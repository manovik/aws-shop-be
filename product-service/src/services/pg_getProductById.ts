import { Sneaker } from 'src/types/types';
import { Client } from 'pg';
import { dbConfig } from '@app/libs/dbConfig';
import { getProductByIdSQL } from '@app/sql';

export const PG_getProductById = async (id: string): Promise<Sneaker[]> => {
  const client = new Client(dbConfig);
  await client.connect();

  try {
    const { rows }: { rows: Sneaker[] } = await client.query(
      getProductByIdSQL(id)
    );

    return rows;
  } catch (err: unknown) {
    console.error(
      '#18 ###### Something went wrong!\n',
      err,
      '\n#############################'
    );
  } finally {
    client.end();
  }
};
