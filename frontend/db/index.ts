import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { existsSync } from 'fs';

// This path is relative to `drizzle.config.ts`, not current file
const DB_FILE_NAME = 'file:../db.db'; // Bad practice, use ENV variables in the future

if (!existsSync(DB_FILE_NAME)) {
    console.log("ERROR: DB file doesn't exist");
}

// variable to hold the db instance
export const db = drizzle(DB_FILE_NAME);
