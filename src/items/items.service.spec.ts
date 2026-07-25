import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DATABASE_CONNECTION } from '../database/database.module';
import { ItemsService } from './items.service';
import { ItemStatus } from './enums/item-status.enum';

describe('ItemsService', () => {
  let service: ItemsService;

  const mockDb = {
    insert: jest.fn(),
    select: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        { provide: DATABASE_CONNECTION, useValue: mockDb },
      ],
    }).compile();

    service = module.get(ItemsService);
    jest.clearAllMocks();
  });

  it('creates an item', async () => {
    const returning = jest.fn().mockResolvedValue([
      {
        id: 1,
        title: 'Test',
        description: 'Desc',
        status: ItemStatus.DRAFT,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    mockDb.insert.mockReturnValue({
      values: jest.fn().mockReturnValue({ returning }),
    });

    const result = await service.create({
      title: 'Test',
      description: 'Desc',
    });

    expect(result.id).toBe(1);
    expect(result.title).toBe('Test');
  });

  it('throws when item is not found', async () => {
    const limit = jest.fn().mockResolvedValue([]);
    const where = jest.fn().mockReturnValue({ limit });
    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({ where }),
    });

    await expect(service.findOne(99)).rejects.toBeInstanceOf(NotFoundException);
  });
});
