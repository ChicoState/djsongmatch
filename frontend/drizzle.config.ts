import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './frontend/db/schema.ts',
    dialect: 'sqlite',
    dbCredentials: {
        url: 'file:./db.db', // Bad practice, use ENV variables in the future
    },
});

