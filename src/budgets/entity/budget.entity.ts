import { defineEntity, p, type InferEntity } from '@mikro-orm/core';
import { BaseEntity } from '../../common/base.entity';
import { Category } from '../../categories/entity/category.entity';
import { BudgetRepository } from '../repository/budget.repository';

export const Budget = defineEntity({
  name: 'Budget',
  extends: BaseEntity,
  repository: () => BudgetRepository,
  uniques: [{ properties: ['year', 'month', 'category'] }],
  properties: {
    // 예산 한도 금액
    // p.decimal('number') — DB는 DECIMAL, JS는 number로 처리
    // precision: 12, scale: 2 → 최대 9,999,999,999.99
    amount: p.decimal('number').precision(12).scale(2),

    year: p.integer(),

    month: p.integer(),

    category: p.manyToOne(() => Category),
  },
});

export type Budget = InferEntity<typeof Budget>;
