import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://vercel-sandbox@127.0.0.1:5432/myapp',
});

export const db = drizzle(pool, { schema });
export * from './schema';
