import { defineConfig } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';

export default defineConfig({
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  dbName: process.env.DATABASE_NAME ?? 'finance_tracker',
  user: process.env.DATABASE_USER ?? 'postgres',
  password: process.env.DATABASE_PASSWORD ?? 'postgres',
  entities: ['dist/**/*.entity.js', 'src/**/*.entity.ts'],
  extensions: [Migrator],
});
