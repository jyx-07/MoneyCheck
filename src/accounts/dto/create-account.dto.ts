import { IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsNotEmpty()
  @Min(0)
  balance: number = 0;
}
