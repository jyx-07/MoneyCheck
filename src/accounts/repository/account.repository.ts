import { EntityRepository } from '@mikro-orm/postgresql';
import { Account } from '../entity/account.entity';

export class AccountRepository extends EntityRepository<Account> {
  // Promise<Account>
  // - Promise: DB 조회는 시간이 걸리므로 비동기 처리
  // - <Account>: 나중에 반환될 값의 타입
  // - await 없이 쓰면 Account가 아닌 Promise 객체가 반환됨
  async findByIdOrFail(id: number): Promise<Account> {
    return await this.findOneOrFail(id);
  }
}
