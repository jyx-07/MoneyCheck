import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CategoryRepository } from './repository/category.repository';
import { Category } from './entity/category.entity';
import { CategoryType } from './enum/category.enum';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

/**
 * 카테고리(수입/지출 분류) 도메인의 비즈니스 로직을 담당하는 서비스.
 * CRUD 및 타입별 조회 기능을 제공합니다.
 */
@Injectable()
export class CategoriesService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Category)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  /**
   * 모든 카테고리를 조회합니다.
   * @returns 전체 카테고리 목록
   */
  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  /**
   * 타입별로 카테고리를 조회합니다.
   * @param type - 조회할 카테고리 타입 (INCOME | EXPENSE)
   * @returns 해당 타입의 카테고리 목록
   */
  async findByType(type: CategoryType): Promise<Category[]> {
    return this.categoryRepository.findByType(type);
  }

  /**
   * ID로 단일 카테고리를 조회합니다.
   * @param id - 카테고리 ID
   * @returns 해당 카테고리
   * @throws NotFoundError — 존재하지 않는 ID일 경우
   */
  async findOne(id: number): Promise<Category> {
    return this.categoryRepository.findByIdOrFail(id);
  }

  /**
   * 새 카테고리를 생성합니다.
   * @param dto - 생성할 카테고리 정보 (name, type)
   * @returns 생성된 카테고리
   */
  async create(dto: CreateCategoryDto): Promise<Category> {
    const category = this.em.create(Category, {
      name: dto.name,
      type: dto.type,
    });

    await this.em.flush();
    return category;
  }

  /**
   * 기존 카테고리를 수정합니다.
   * @param id - 수정할 카테고리 ID
   * @param dto - 변경할 필드 (name?, type?)
   * @returns 수정된 카테고리
   * @throws NotFoundError — 존재하지 않는 ID일 경우
   */
  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findByIdOrFail(id);

    this.em.assign(category, dto);
    await this.em.flush();
    return category;
  }

  /**
   * 카테고리를 삭제합니다.
   * @param id - 삭제할 카테고리 ID
   * @throws NotFoundError — 존재하지 않는 ID일 경우
   */
  async remove(id: number): Promise<void> {
    const category = await this.categoryRepository.findByIdOrFail(id);
    this.em.remove(category);
    await this.em.flush();
  }
}
