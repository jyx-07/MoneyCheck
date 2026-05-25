import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Account } from './entity/account.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Account])],
  providers: [AccountsService],
  controllers: [AccountsController],
})
export class AccountsModule {}
