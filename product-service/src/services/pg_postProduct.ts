import { PostSneaker } from 'src/types/types';
import { Client, QueryResult } from 'pg';
import { dbConfig } from '@app/libs/dbConfig';
import { postProductSQL } from '@app/sql';

export const PG_postProduct = async ({
  count,
  img,
  price,
  description,
  title,
}: PostSneaker): Promise<QueryResult<any>> => {
  const client = new Client(dbConfig);
  await client.connect();

  try {
    const { rows } = await client.query(
      postProductSQL({
        count,
        img,
        price,
        description,
        title,
      })
    );

    return rows[0].id;
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
