import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

// CreateCategoryDto의 모든 필드를 optional로 변환
// name만 보내도 되고, type만 보내도 됨
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
