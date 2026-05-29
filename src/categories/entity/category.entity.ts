import { BaseEntity } from '../../common/base.entity';
import { defineEntity, p, type InferEntity } from '@mikro-orm/core';
import { CategoryType } from '../enum/category.enum';
import { CategoryRepository } from '../repository/category.repository';

// defineEntity — 클래스 대신 순수 객체로 엔티티 스키마를 정의하는 방식
// 데코레이터 방식과 달리 reflect-metadata 없이도 타입 추론이 가능
export const Category = defineEntity({
  // 이 엔티티를 식별하는 이름
  // 테이블명은 snake_case로 자동 변환 → category
  name: 'Category',

  // BaseEntity 상속 — id, createdAt, updatedAt을 자동으로 포함
  extends: BaseEntity,

  // 이 엔티티 전용 커스텀 레포지토리 지정
  // 순환 참조 방지를 위해 () => CategoryRepository 함수 형태로 전달
  repository: () => CategoryRepository,

  properties: {
    // 카테고리명 — VARCHAR, NOT NULL
    name: p.string(),

    // 카테고리 타입 — INCOME(수입) 또는 EXPENSE(지출)
    // p.enum() — DB에 문자열로 저장, CategoryType에 없는 값은 저장 불가
    type: p.enum(CategoryType),
  },
});

// InferEntity — defineEntity 스키마 객체에서 TypeScript 타입을 자동 추론
// const Category: 스키마 객체 (MikroORM이 사용)
// type Category: TypeScript 타입 (서비스, 레포지토리에서 타입으로 사용)
// 결과 타입: { id: number, createdAt: Date, updatedAt: Date, name: string, type: CategoryType }
export type Category = InferEntity<typeof Category>;
