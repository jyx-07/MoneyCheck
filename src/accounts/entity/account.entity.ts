import { defineEntity, p, type InferEntity } from '@mikro-orm/core';
import { BaseEntity } from '../../common/base.entity';
import { AccountRepository } from '../repository/account.repository';

export const Account = defineEntity({
  name: 'Account',
  extends: BaseEntity,
  repository: () => AccountRepository,
  properties: {
    name: p.string(),
    // float 대신 정확한 10진수 타입 사용 (금액 오차 방지)
    // precision: 12 — 전체 자릿수 최대 12자리, scale: 2 — 소수점 이하 2자리 (최대 9,999,999,999.99)
    balance: p.decimal('number').precision(12).scale(2).default(0),
  },
});

export type Account = InferEntity<typeof Account>;
