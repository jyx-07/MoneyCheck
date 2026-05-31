import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Transaction } from './entity/transaction.entity';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { AccountsModule } from '../accounts/accounts.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    // 이 모듈 범위에서 Transaction 엔티티 사용 등록
    MikroOrmModule.forFeature([Transaction]),
    // AccountRepository, CategoryRepository 사용을 위해 import
    AccountsModule,
    CategoriesModule,
  ],
  providers: [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
