//Initialize the driver

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'; /* import all the tables from schema so we can run queries*/

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema }); /* allows us to use db wheereever in the app */
