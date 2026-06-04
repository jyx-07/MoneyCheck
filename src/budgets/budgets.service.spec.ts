import { Test, TestingModule } from '@nestjs/testing';
import { BudgetsService } from './budgets.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Budget } from './entity/budget.entity';
import { Category } from '../categories/entity/category.entity';

describe('BudgetsService', () => {
  let service: BudgetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetsService,
        {
          provide: EntityManager,
          useValue: {
            create: jest.fn(),
            flush: jest.fn(),
            assign: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Budget),
          useValue: {
            findAll: jest.fn(),
            findByYearAndMonth: jest.fn(),
            findByIdOrFail: jest.fn(),
            findByYearMonthAndCategory: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Category),
          useValue: {
            findByIdOrFail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BudgetsService>(BudgetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
