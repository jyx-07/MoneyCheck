import { EntityRepository } from '@mikro-orm/core';
import { Budget } from '../entity/budget.entity';

export class BudgetRepository extends EntityRepository<Budget> {
  // id로 단건 조회, 없으면 NotFoundError
  async findByIdOrFail(id: number): Promise<Budget> {
    return this.findOneOrFail({ id });
  }

  // 연월별 예산 목록 조회
  async findByYearAndMonth(year: number, month: number): Promise<Budget[]> {
    return this.find({ year, month });
  }

  // 특정 카테고리의 특정 연월 예산 조회
  // year + month + category 조합으로 중복 체크할 때 사용
  async findByYearMonthAndCategory(
    year: number,
    month: number,
    categoryId: number,
  ): Promise<Budget | null> {
    return this.findOne({ year, month, category: categoryId });
  }
}
