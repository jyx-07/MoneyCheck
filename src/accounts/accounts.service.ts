import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { AccountRepository } from './repository/account.repository';
import { Account } from './entity/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    private readonly em: EntityManager,
    private readonly accountsRepository: AccountRepository,
  ) {}

  async getAllAccounts(): Promise<Account[]> {
    return this.accountsRepository.findAll();
  }

  async findOne(id: number): Promise<Account> {
    return this.accountsRepository.findOneOrFail(id);
  }

  async createAccount(dto: CreateAccountDto): Promise<Account> {
    const account = this.em.create(Account, {
      name: dto.name,
      balance: dto.balance,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.em.flush();
    return account;
  }

  async updateAccount(id: number, dto: UpdateAccountDto): Promise<Account> {
    const account = await this.accountsRepository.findOneOrFail(id);

    // assign — dto의 필드를 엔티티에 한 번에 반영
    // undefined 필드는 건드리지 않음
    // 이후 flush 시 Dirty Checking으로 변경된 필드만 UPDATE
    this.em.assign(account, dto);

    await this.em.flush();
    return account;
  }

  async removeAccount(id: number): Promise<void> {
    const account = await this.accountsRepository.findByIdOrFail(id)
    this.em.remove(account);
    await this.em.flush();
  }
}
