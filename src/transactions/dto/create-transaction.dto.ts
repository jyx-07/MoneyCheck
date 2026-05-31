import {
  IsNumber,
  IsEnum,
  IsOptional,
  IsString,
  IsPositive,
  IsDateString,
} from 'class-validator';
import { TransactionType } from '../enum/transaction.enum';

export class CreateTransactionDto {
  // 거래 금액 — 양수만 허용
  @IsNumber()
  @IsPositive()
  amount!: number;

  // INCOME 또는 EXPENSE만 허용
  @IsEnum(TransactionType)
  type!: TransactionType;

  // 거래일 — ISO 8601 형식 (2024-01-01)
  @IsDateString()
  date!: string;

  // 메모 — 선택값
  @IsOptional()
  @IsString()
  memo?: string;

  // 계좌 id
  @IsNumber()
  accountId!: number;

  // 카테고리 id
  @IsNumber()
  categoryId!: number;
}
