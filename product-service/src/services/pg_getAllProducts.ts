import { Sneaker } from 'src/types/types';
import { Client } from 'pg';
import { dbConfig } from '@app/libs/dbConfig';
import { getAllProductsSQL } from '@app/sql';

export const PG_getAllProducts = async (): Promise<Sneaker[]> => {
  const client = new Client(dbConfig);
  await client.connect();

  try {
    const { rows }: { rows: Sneaker[] } = await client.query(getAllProductsSQL());

    return rows;
  } catch (err: unknown) {
    console.error(
      '#16 ###### Something went wrong!\n',
      err,
      '\n#############################'
    );
  } finally {
    client.end();
  }
};
