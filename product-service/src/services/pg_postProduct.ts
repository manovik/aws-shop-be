import { PostSneaker } from 'src/types/types';
import { Client, QueryResultRow } from 'pg';
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
    logger.info({
      msg: `#29 ###### ${productErrorText}`,
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
    });
    return {
      error:
        "One of values was not provided or it's type doesn't passed validation. " +
        productErrorText,
    };
  }

  const client = new Client(dbConfig);
  await client.connect();

  try {
    const { rows }: {rows: QueryResultRow} = await client.query(
      postProductSQL({
        count,
        img,
        price,
        description,
        title,
      })
    );
    const hashEnd = `...${rows[0].id.slice(-6)}`
    logger.info({
      msg: `${hashEnd} added to database now`,
    });

    return hashEnd;
  } catch (error: unknown) {
    logger.info({
      msg: '#73 ###### Something went wrong with database!\n',
      error
    });
    return {
      error: productErrorText,
    };
  } finally {
    client.end();
  }
};
