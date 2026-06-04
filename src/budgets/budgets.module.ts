import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Budget } from './entity/budget.entity';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [MikroOrmModule.forFeature([Budget]), CategoriesModule],
  controllers: [BudgetsController],
  providers: [BudgetsService],
})
export class BudgetsModule {}
