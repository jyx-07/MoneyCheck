import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('summary')
  getMonthlySummary(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.statisticsService.getMonthlySummary(year, month);
  }

  @Get('category-expenses')
  getCategoryExpenses(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.statisticsService.getCategoryExpenses(year, month);
  }

  @Get('budget-comparison')
  getBudgetComparison(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.statisticsService.getBudgetComparison(year, month);
  }
}
