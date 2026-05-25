import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Account } from './entity/account.entity';
import { AccountRepository } from './repository/account.repository';

@Module({
  imports: [MikroOrmModule.forFeature([Account])],
  providers: [AccountsService, AccountRepository],
  controllers: [AccountsController],
  exports: [AccountRepository],
})
export class AccountsModule {}
