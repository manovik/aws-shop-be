import { dbConfig } from '@app/libs/dbConfig';
import { deleteProductSQL } from '@app/sql';
import { cutId } from '@app/utils/cutId';
import { logger } from '@app/utils/logger';
import { Client } from 'pg';

export const pg_markProductAsDeleted = async (id: string): Promise<void> => {
  const currentTime = new Date().toISOString().replace(/[TZ]/g, ' ').trim();
  const client = new Client(dbConfig);
  try {
    await client.connect();
    await client.query(deleteProductSQL(), [currentTime, id]);

    logger.info(`Product with id "${ cutId(id) }" marked as deleted`);
  } catch (err: unknown) {
    logger.info(
      err,
      `Something went wrong while deleting product with id "${ cutId(id) }"!`,
    );
  } finally {
    client.end();
  }
};
