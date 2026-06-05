import { defineEntity, p, type InferEntity } from '@mikro-orm/core';
import { BaseEntity } from '../../common/base.entity';
import { Account } from '../../accounts/entity/account.entity';
import { Category } from '../../categories/entity/category.entity';
import { TransactionRepository } from '../repository/transaction.repository';
import { TransactionType } from '../enum/transaction.enum';

export const Transaction = defineEntity({
  // MikroORM 내부에서 이 엔티티를 식별하는 이름
  // 테이블명 snake_case 자동 변환 → transaction
  name: 'Transaction',

  // BaseEntity 상속 — id, createdAt, updatedAt 자동 포함
  extends: BaseEntity,

  // 순환 참조 방지를 위해 () => TransactionRepository 함수 형태로 전달
  repository: () => TransactionRepository,

  properties: {
    // p.decimal('number') — DB는 DECIMAL 타입으로 저장 (정확한 10진수)
    // 'number'는 JS에서 다룰 때 number 타입으로 받겠다는 의미
    // .precision(12) — 전체 자릿수 최대 12자리
    // .scale(2) — 소수점 이하 2자리 (최대 9,999,999,999.99)
    // amount는 항상 양수, 방향은 type으로 구분
    amount: p.decimal('number').precision(12).scale(2),

    // p.enum() — DB에 문자열로 저장 (INCOME / EXPENSE)
    // TransactionType에 없는 값은 저장 불가
    type: p.enum(TransactionType),

    // p.date() — DB에 DATE 타입으로 저장 (시간 없이 날짜만)
    // 실제 거래가 발생한 날짜
    date: p.date(),

    // .nullable() — null 허용, 선택값
    memo: p.string().nullable(),

    // p.manyToOne() — N:1 관계 선언
    // 여러 거래가 하나의 계좌에 속함
    account: p.manyToOne(Account),

    // 여러 거래가 하나의 카테고리에 속함
    category: p.manyToOne(Category),
  },
});

// InferEntity — defineEntity 스키마 객체에서 TypeScript 타입 자동 추론
// const Transaction: 스키마 객체 (MikroORM이 사용)
// type Transaction: TypeScript 타입 (서비스, 레포지토리에서 타입으로 사용)
export type Transaction = InferEntity<typeof Transaction>;
