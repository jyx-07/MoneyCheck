import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 전역 ValidationPipe 등록
  // ValidationPipe는 클라이언트로부터 들어오는 요청 데이터(DTO)를 클래 기반으로 자동검증 및 변환하는 파이프
  // whitelist: true — DTO에 정의되지 않은 필드는 자동 제거
  // 클라이언트가 엉뚱한 필드를 보내도 무시됨
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
