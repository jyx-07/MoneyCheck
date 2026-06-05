import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';

@Module({
  // 별도 엔티티/레포지토리 없음
  // EntityManager로 직접 Transaction, Budget 조회
  providers: [StatisticsService],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
