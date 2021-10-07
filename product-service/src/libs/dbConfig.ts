import { ClientConfig } from 'pg';

const { PG_HOST, PG_PORT, PG_DB, PG_USER, PG_PASS } = process.env;

export const dbConfig: ClientConfig = {
  host: PG_HOST,
  port: +PG_PORT,
  database: PG_DB,
  user: PG_USER,
  password: PG_PASS,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};