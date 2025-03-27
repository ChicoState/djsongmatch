import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { existsSync } from 'fs';

// This path is relative to `drizzle.config.ts`, not current file
const DB_FILE_NAME = 'file:../db.db'; // Bad practice, use ENV variables in the future

// variable to hold the db instance
export const db = drizzle(DB_FILE_NAME);
