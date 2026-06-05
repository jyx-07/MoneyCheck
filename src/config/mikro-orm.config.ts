import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';

export default defineConfig({
  // Fly.io는 DATABASE_URL로 DB 연결 정보를 넘겨줌
  // 로컬에서는 개별 환경변수로 연결
  clientUrl: process.env.DATABASE_URL,
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  dbName: process.env.DATABASE_NAME ?? 'finance_tracker',
  user: process.env.DATABASE_USER ?? 'postgres',
  password: process.env.DATABASE_PASSWORD ?? 'postgres',
  // CLI 실행 시 TS 파일 직접 읽음
  // 프로덕션 빌드 시에는 dist 경로 사용
  entities:
    process.env.NODE_ENV === 'production'
      ? ['dist/**/*.entity.js']
      : ['src/**/*.entity.ts'],
  entitiesTs: ['src/**/*.entity.ts'],
  extensions: [Migrator],
});
