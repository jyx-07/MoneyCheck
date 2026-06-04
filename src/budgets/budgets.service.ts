import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Budget } from './entity/budget.entity';
import { BudgetRepository } from './repository/budget.repository';
import { Category } from '../categories/entity/category.entity';
import { CategoryRepository } from '../categories/repository/category.repository';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Budget)
    private readonly budgetRepository: BudgetRepository,
    @InjectRepository(Category)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async findAll(): Promise<Budget[]> {
    return this.budgetRepository.findAll();
  }

  async findByYearAndMonth(year: number, month: number): Promise<Budget[]> {
    return this.budgetRepository.findByYearAndMonth(year, month);
  }

  async findOne(id: number): Promise<Budget> {
    return this.budgetRepository.findByIdOrFail(id);
  }

  async create(dto: CreateBudgetDto): Promise<Budget> {
    const existing = await this.budgetRepository.findByYearMonthAndCategory(
      dto.year,
      dto.month,
      dto.categoryId,
    );

    if (existing) {
      throw new BadRequestException(
        `${dto.year}년 ${dto.month}월 해당 카테고리 예산이 이미 존재합니다`,
      );
    }

    const category = await this.categoryRepository.findByIdOrFail(dto.categoryId);

    const budget = this.em.create(Budget, {
      amount: dto.amount,
      year: dto.year,
      month: dto.month,
      category,
    });

    await this.em.flush();
    return budget;
  }

  async update(id: number, dto: UpdateBudgetDto): Promise<Budget> {
    const budget = await this.budgetRepository.findByIdOrFail(id);

    const { categoryId, ...rest } = dto;
    const targetYear = dto.year ?? budget.year;
    const targetMonth = dto.month ?? budget.month;
    const targetCategoryId = categoryId ?? budget.category.id;

    if (
      targetYear !== budget.year ||
      targetMonth !== budget.month ||
      targetCategoryId !== budget.category.id
    ) {
      const existing = await this.budgetRepository.findByYearMonthAndCategory(
        targetYear,
        targetMonth,
        targetCategoryId,
      );

      if (existing && existing.id !== id) {
        throw new BadRequestException(
          `${targetYear}년 ${targetMonth}월 해당 카테고리 예산이 이미 존재합니다`,
        );
      }
    }

    if (categoryId !== undefined) {
      const category = await this.categoryRepository.findByIdOrFail(categoryId);
      this.em.assign(budget, { ...rest, category });
    } else {
      this.em.assign(budget, rest);
    }

    await this.em.flush();
    return budget;
  }

  async remove(id: number): Promise<void> {
    const budget = await this.budgetRepository.findByIdOrFail(id);
    this.em.remove(budget);
    await this.em.flush();
  }
}
