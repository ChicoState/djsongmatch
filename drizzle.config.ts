import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/db/ts/schema.ts',
    dialect: 'sqlite',
    dbCredentials: {
        url: 'file:./src/db/db.db', // Bad practice, use ENV variables in the future
    },
});

