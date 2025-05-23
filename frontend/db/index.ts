import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import path from "path";
import dotenv from "dotenv";
import * as schema from "./schema";

/* Root of git repo. Contains frontend/ and backend/ */
const projectRoot = path.resolve(__dirname, "../../../../");

const envPath = path.resolve(projectRoot, ".env");

dotenv.config({
  path: envPath,
});

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Do you have a .env file?",
  );
}

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(process.env.DATABASE_URL!);
if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
