import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class MonthPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const month = parseInt(value, 10);
    if (isNaN(month) || month < 1 || month > 12) {
      throw new BadRequestException('month는 1~12 사이의 정수여야 합니다.');
    }
    return month;
  }
}
