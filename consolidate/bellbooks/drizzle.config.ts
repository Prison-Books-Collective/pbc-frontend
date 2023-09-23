import type { Config } from 'drizzle-kit'

export default {
  schema: './src/db/schema.ts',
  out: './src/db',
  driver: 'mysql2',
  dbCredentials: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    database: 'migration',
  },
} satisfies Config
