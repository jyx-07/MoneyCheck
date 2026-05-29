import { EntityRepository } from '@mikro-orm/core';
import { type Category } from '../entity/category.entity';
import { CategoryType } from '../enum/category.enum';

export class CategoryRepository extends EntityRepository<Category> {
  async findByIdOrFail(id: number): Promise<Category> {
    return this.findOneOrFail({ id });
  }

  async findByType(type: CategoryType): Promise<Category[]> {
    return this.find({ type });
  }
}
