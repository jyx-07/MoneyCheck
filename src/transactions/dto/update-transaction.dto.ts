import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';

// CreateTransactionDto의 모든 필드를 optional로 변환
export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
