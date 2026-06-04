import { IsNumber, IsPositive, IsInt, Min, Max } from 'class-validator';

export class CreateBudgetDto {
  // 예산 한도 금액 — 양수만 허용
  @IsNumber()
  @IsPositive()
  amount!: number;

  // 예산 연도
  @IsInt()
  year!: number;

  // 예산 월 — 1 ~ 12만 허용
  @IsInt()
  @Min(1)
  @Max(12)
  month!: number;

  // 카테고리 id
  @IsInt()
  categoryId!: number;
}
