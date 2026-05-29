import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { CategoryRepository } from './repository/category.repository';
import { Category } from './entity/category.entity';
import { CategoryType } from './enum/category.enum';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly em: EntityManager,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async findByType(type: CategoryType): Promise<Category[]> {
    return this.categoryRepository.findByType(type);
  }

  async findOne(id: number): Promise<Category> {
    return this.categoryRepository.findOneOrFail(id);
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const category = this.em.create(Category, {
      name: dto.name,
      type: dto.type,
    });

    await this.em.flush();
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findOneOrFail(id);

    this.em.assign(category, dto);
    await this.em.flush();
    return category;
  }

  async remove(id: number): Promise<void> {
    const category = await this.categoryRepository.findOneOrFail(id);
    this.em.remove(category);
    await this.em.flush();
  }
}
