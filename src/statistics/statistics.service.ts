import { Injectable, Inject } from '@nestjs/common';
import { EntityManager as CoreEntityManager, raw } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Budget } from '../budgets/entity/budget.entity';
import { Category } from '../categories/entity/category.entity';
import { Transaction } from '../transactions/entity/transaction.entity';
import { TransactionType } from '../transactions/enum/transaction.enum';

type SummaryRow = { type: string; total: string };
type CategoryExpenseRow = { category_id: number; category_name: string; total: string };
type ExpenseByCategoryRow = { category_id: number; total: string };

@Injectable()
export class StatisticsService {
  constructor(@Inject(CoreEntityManager) private readonly em: EntityManager) {}

  async getMonthlySummary(year: number, month: number) {
    const [from, to] = monthDateRange(year, month);

    // DB 수준 집계 — type별 SUM
    const rows = (await this.em
      .createQueryBuilder(Transaction, 't')
      .select(['t.type', raw('SUM(t.amount) as total')])
      .where({ date: { $gte: from, $lte: to } })
      .groupBy('t.type')
      .execute('all')) as SummaryRow[];

    const totalIncome = Number(
      rows.find((r) => r.type === TransactionType.INCOME)?.total ?? 0,
    );
    const totalExpense = Number(
      rows.find((r) => r.type === TransactionType.EXPENSE)?.total ?? 0,
    );

    return { year, month, totalIncome, totalExpense, netAmount: totalIncome - totalExpense };
  }

  async getCategoryExpenses(year: number, month: number) {
    const [from, to] = monthDateRange(year, month);

    // DB 수준 집계 — category join 후 SUM + GROUP BY
    const rows = (await this.em
      .createQueryBuilder(Transaction, 't')
      .select([
        raw('c.id as category_id'),
        raw('c.name as category_name'),
        raw('SUM(t.amount) as total'),
      ])
      .leftJoin('t.category', 'c')
      .where({ date: { $gte: from, $lte: to }, type: TransactionType.EXPENSE })
      .groupBy([raw('c.id'), raw('c.name')])
      .execute('all')) as CategoryExpenseRow[];

    return rows.map((r) => ({
      categoryId: Number(r.category_id),
      categoryName: String(r.category_name),
      total: Number(r.total),
    }));
  }

  async getBudgetComparison(year: number, month: number) {
    const [from, to] = monthDateRange(year, month);

    const budgets = await this.em.find(Budget, { year, month }, { populate: ['category'] });

    // DB 수준 집계 — category별 지출 SUM
    const expenseRows = (await this.em
      .createQueryBuilder(Transaction, 't')
      .select(['t.category', raw('SUM(t.amount) as total')])
      .where({ date: { $gte: from, $lte: to }, type: TransactionType.EXPENSE })
      .groupBy('t.category')
      .execute('all')) as ExpenseByCategoryRow[];

    const expenseByCategory = new Map(
      expenseRows.map((r) => [Number(r.category_id), Number(r.total)]),
    );

    return budgets.map((budget) => {
      const category = budget.category as Category;
      const categoryId = category.id;
      const categoryName = category.name;
      const actualAmount = expenseByCategory.get(categoryId) ?? 0;
      return {
        categoryId,
        categoryName,
        budgetAmount: budget.amount,
        actualAmount,
        remainingAmount: budget.amount - actualAmount,
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
