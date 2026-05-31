import { EntityRepository } from '@mikro-orm/core';
import { type Transaction } from '../entity/transaction.entity';

export class TransactionRepository extends EntityRepository<Transaction> {
  // id로 단건 조회, 없으면 NotFoundError
  async findByIdOrFail(id: number): Promise<Transaction> {
    return this.findOneOrFail({ id });
  }

  // 계좌별 거래 내역 조회
  async findByAccountId(accountId: number): Promise<Transaction[]> {
    return this.find({ account: accountId });
  }

  // 카테고리별 거래 내역 조회
  async findByCategoryId(categoryId: number): Promise<Transaction[]> {
    return this.find({ category: categoryId });
  }
}
