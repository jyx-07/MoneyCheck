import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CategoriesModule } from './categories/categories.module';
import config from './config/mikro-orm.config';

@Module({
  imports: [
    // forRoot — 앱 전체에서 MikroORM 사용할 수 있도록 루트에서 초기화
    // 내부적으로 요청마다 EM을 fork해서 Request Scope로 관리
    MikroOrmModule.forRoot(config),
    AccountsModule,
    CategoriesModule,
  ],
})
export class AppModule {}
