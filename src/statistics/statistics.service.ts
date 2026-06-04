import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Transaction } from '../transactions/entity/transaction.entity';
import { Budget } from '../budgets/entity/budget.entity';
import { Category } from '../categories/entity/category.entity';
import { TransactionType } from '../transactions/enum/transaction.enum';

@Injectable()
export class StatisticsService {
  constructor(
    // 직접 쿼리를 위해 EntityManager 주입
    // 별도 레포지토리 없이 em으로 집계 쿼리 처리
    private readonly em: EntityManager,
  ) {}

  // 특정 연월 수입/지출 합계 조회
  async getMonthlySummary(year: number, month: number) {
    const [from, to] = monthDateRange(year, month);

    // 해당 월 전체 거래 조회
    const transactions = await this.em.find(Transaction, {
      date: { $gte: from, $lte: to },
    });

    // 수입 합계
    const totalIncome = transactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    // 지출 합계
    const totalExpense = transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      year,
      month,
      totalIncome,
      totalExpense,
      // 순수익 — 수입 - 지출
      netAmount: totalIncome - totalExpense,
    };
  }

  // 카테고리별 지출 합계 조회
  async getCategoryExpenses(year: number, month: number) {
    const [from, to] = monthDateRange(year, month);

    // 지출 거래만 조회 + category populate
    // populate — lazy 관계라 명시적으로 불러와야 카테고리 정보 접근 가능
    const transactions = await this.em.find(
      Transaction,
      {
        date: { $gte: from, $lte: to },
        type: TransactionType.EXPENSE,
      },
      { populate: ['category'] },
    );

    // 카테고리별로 그룹핑해서 합계 계산
    const result = transactions.reduce(
      (acc, t) => {
        const category = t.category as Category;
        const { id: categoryId, name: categoryName } = category;

        if (!acc[categoryId]) {
          acc[categoryId] = { categoryId, categoryName, total: 0 };
        }
        acc[categoryId].total += t.amount;
        return acc;
      },
      {} as Record<
        number,
        { categoryId: number; categoryName: string; total: number }
      >,
    );

    return Object.values(result);
  }

  // 예산 대비 실제 지출 비교
  async getBudgetComparison(year: number, month: number) {
    const [from, to] = monthDateRange(year, month);

    // 해당 월 예산 목록 조회 + category populate
    const budgets = await this.em.find(
      Budget,
      { year, month },
      { populate: ['category'] },
    );

    // 해당 월 지출 거래 조회 + category populate
    const transactions = await this.em.find(
      Transaction,
      {
        date: { $gte: from, $lte: to },
        type: TransactionType.EXPENSE,
      },
      { populate: ['category'] },
    );

    // 카테고리별 실제 지출 합계
    const expenseByCategory = transactions.reduce(
      (acc, t) => {
        const categoryId = (t.category as Category).id;
        acc[categoryId] = (acc[categoryId] ?? 0) + t.amount;
        return acc;
      },
      {} as Record<number, number>,
    );

    // 예산 vs 실제 지출 비교
    return budgets.map((budget) => {
      const category = budget.category as Category;
      const categoryId = category.id;
      const categoryName = category.name;
      return {
        categoryId,
        categoryName,
        budgetAmount: budget.amount,
        actualAmount: expenseByCategory[categoryId] ?? 0,
        remainingAmount: budget.amount - (expenseByCategory[categoryId] ?? 0),
      };
    });
  }
}

// p.date() 는 string 타입 — YYYY-MM-DD 포맷으로 필터에 전달해야 함
function monthDateRange(year: number, month: number): [string, string] {
  const pad = (n: number) => String(n).padStart(2, '0');
  const lastDay = new Date(year, month, 0).getDate();
  return [`${year}-${pad(month)}-01`, `${year}-${pad(month)}-${pad(lastDay)}`];
}
