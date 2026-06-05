import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { AccountRepository } from './repository/account.repository';
import { Account } from './entity/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

/**
 * 계좌 도메인의 비즈니스 로직을 담당하는 서비스.
 * 계좌 생성, 조회, 수정, 삭제 기능을 제공합니다.
 */
@Injectable()
export class AccountsService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Account)
    private readonly accountsRepository: AccountRepository,
  ) {}

  /**
   * 모든 계좌를 조회합니다.
   * @returns 전체 계좌 목록
   */
  async getAllAccounts(): Promise<Account[]> {
    return this.accountsRepository.findAll();
  }

  /**
   * ID로 단일 계좌를 조회합니다.
   * @param id - 계좌 ID
   * @returns 해당 계좌
   * @throws NotFoundError — 존재하지 않는 ID일 경우
   */
  async findOne(id: number): Promise<Account> {
    return this.accountsRepository.findOneOrFail(id);
  }

  /**
   * 새 계좌를 생성합니다.
   * @param dto - 생성할 계좌 정보 (name, balance)
   * @returns 생성된 계좌
   */
  async createAccount(dto: CreateAccountDto): Promise<Account> {
    const account = this.em.create(Account, {
      name: dto.name,
      balance: dto.balance,
    });

    await this.em.flush();
    return account;
  }

  /**
   * 기존 계좌를 수정합니다.
   * @param id - 수정할 계좌 ID
   * @param dto - 변경할 필드 (name?, balance?)
   * @returns 수정된 계좌
   * @throws NotFoundError — 존재하지 않는 ID일 경우
   */
  async updateAccount(id: number, dto: UpdateAccountDto): Promise<Account> {
    const account = await this.accountsRepository.findOneOrFail(id);

    this.em.assign(account, dto);

    await this.em.flush();
    return account;
  }

  /**
   * 계좌를 삭제합니다.
   * @param id - 삭제할 계좌 ID
   * @throws NotFoundError — 존재하지 않는 ID일 경우
   */
  async removeAccount(id: number): Promise<void> {
    const account = await this.accountsRepository.findByIdOrFail(id);
    this.em.remove(account);
    await this.em.flush();
  }
}
