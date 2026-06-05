import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';

export default defineConfig({
  // DATABASE_URL이 있으면 그것만 사용, 없으면 개별 환경변수 사용
  ...(process.env.DATABASE_URL
    ? { clientUrl: process.env.DATABASE_URL }
    : {
        host: process.env.DATABASE_HOST ?? 'localhost',
        port: Number(process.env.DATABASE_PORT ?? 5432),
        dbName: process.env.DATABASE_NAME ?? 'finance_tracker',
        user: process.env.DATABASE_USER ?? 'postgres',
        password: process.env.DATABASE_PASSWORD ?? 'postgres',
      }),
  entities:
    process.env.NODE_ENV === 'production'
      ? ['dist/**/*.entity.js']
      : ['src/**/*.entity.ts'],
  entitiesTs: ['src/**/*.entity.ts'],
  extensions: [Migrator],
});
