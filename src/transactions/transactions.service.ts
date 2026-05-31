import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Transaction } from '../transactions/entity/transaction.entity';
import { TransactionRepository } from './repository/transaction.repository';
import { AccountRepository } from '../accounts/repository/account.repository';
import { CategoryRepository } from '../categories/repository/category.repository';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionType } from './enum/transaction.enum';

@Injectable()
export class TransactionsService {
  constructor(
    // Unit of Work, Identity Map 관리
    private readonly em: EntityManager,
    private readonly transactionRepository: TransactionRepository,
    // 거래 생성/삭제 시 계좌 잔액 업데이트를 위해 주입
    private readonly accountRepository: AccountRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  // 전체 거래 내역 조회
  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.findAll();
  }

  // 단건 조회, 없으면 NotFoundError
  async findOne(id: number): Promise<Transaction> {
    return this.transactionRepository.findByIdOrFail(id);
  }

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    // 잔액 변경 + 거래 생성을 하나의 트랜잭션으로 묶음
    // 둘 중 하나라도 실패하면 전체 rollback
    return this.em.transactional(async (em) => {
      // 계좌 조회 — 잔액 업데이트를 위해
      const account = await this.accountRepository.findByIdOrFail(
        dto.accountId,
      );
      const category = await this.categoryRepository.findByIdOrFail(
        dto.categoryId,
      );

      // 잔액 업데이트
      // INCOME — 잔액 증가, EXPENSE — 잔액 감소
      if (dto.type === TransactionType.INCOME) {
        account.balance += dto.amount;
      } else {
        account.balance -= dto.amount;
      }

      // 거래 생성 — Identity Map 등록
      const transaction = em.create(Transaction, {
        amount: dto.amount,
        type: dto.type,
        date: dto.date,
        memo: dto.memo,
        account,
        category,
      });

      // transactional() 블록 종료 시 자동으로 flush + commit
      return transaction;
    });
  }

  async remove(id: number): Promise<void> {
    // 잔액 복구 + 거래 삭제를 하나의 트랜잭션으로 묶음
    await this.em.transactional(async (em) => {
      const transaction = await this.transactionRepository.findByIdOrFail(id);

      // lazy 관계라 명시적으로 populate 필요
      await em.populate(transaction, ['account']);

      // 삭제 시 잔액 복구 — 거래 방향 반대로 적용
      if (transaction.type === TransactionType.INCOME) {
        transaction.account.balance -= transaction.amount;
      } else {
        transaction.account.balance += transaction.amount;
      }

      em.remove(transaction);
      // transactional() 블록 종료 시 자동으로 flush + commit
    });
  }
}
