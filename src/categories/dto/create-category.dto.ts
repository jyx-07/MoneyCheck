import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CategoryType } from '../enum/category.enum';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(CategoryType)
  @IsNotEmpty()
  type!: CategoryType;
}
