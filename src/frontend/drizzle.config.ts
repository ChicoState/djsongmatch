import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './src/frontend/lib/db/schema.ts',
    dialect: 'sqlite',
    dbCredentials: {
        url: 'file:./src/db/ClassicHit.db', // Bad practice, use ENV variables in the future
    },
});

