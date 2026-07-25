import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, count, desc, eq, ilike, SQL } from 'drizzle-orm';
import { ApiSuccessResponseWithPagination } from '../common/interfaces/api-response.interface';
import { PaginationMeta } from '../common/interfaces/pagination-meta.interface';
import type { Database } from '../database/database-connection';
import { DATABASE_CONNECTION } from '../database/database.module';
import { items } from '../database/schema';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemQueryDto } from './dto/item-query.dto';
import { ItemDetailDto, ItemListItemDto } from './dto/item-response.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemStatus } from './enums/item-status.enum';

const SORT_COLUMN_MAP = {
  title: items.title,
  status: items.status,
  createdAt: items.createdAt,
} as const;

@Injectable()
export class ItemsService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

  async create(dto: CreateItemDto): Promise<ItemDetailDto> {
    const [item] = await this.db
      .insert(items)
      .values({
        title: dto.title,
        description: dto.description,
        status: dto.status ?? ItemStatus.DRAFT,
      })
      .returning();

    return this.toDetailDto(item);
  }

  async findAll(
    query: ItemQueryDto,
  ): Promise<ApiSuccessResponseWithPagination<ItemListItemDto[]>> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      order = 'asc',
      title,
      status,
    } = query;

    const conditions: SQL[] = [];
    if (title) conditions.push(ilike(items.title, `%${title}%`));
    if (status) conditions.push(eq(items.status, status));

    const whereClause = conditions.length ? and(...conditions) : undefined;
    const sortColumn = SORT_COLUMN_MAP[sortBy];
    const orderFn = order === 'desc' ? desc : asc;

    const [rows, [{ total }]] = await Promise.all([
      this.db
        .select()
        .from(items)
        .where(whereClause)
        .orderBy(orderFn(sortColumn))
        .limit(limit)
        .offset((page - 1) * limit),
      this.db.select({ total: count() }).from(items).where(whereClause),
    ]);

    const meta: PaginationMeta = {
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    };

    return {
      data: rows.map((row) => this.toListItemDto(row)),
      meta,
    };
  }

  async findOne(id: number): Promise<ItemDetailDto> {
    const [item] = await this.db
      .select()
      .from(items)
      .where(eq(items.id, id))
      .limit(1);

    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }

    return this.toDetailDto(item);
  }

  async update(id: number, dto: UpdateItemDto): Promise<ItemDetailDto> {
    await this.findOne(id);

    const [updated] = await this.db
      .update(items)
      .set(dto)
      .where(eq(items.id, id))
      .returning();

    return this.toDetailDto(updated);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.db.delete(items).where(eq(items.id, id));
  }

  private toListItemDto(row: typeof items.$inferSelect): ItemListItemDto {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status as ItemStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  private toDetailDto(row: typeof items.$inferSelect): ItemDetailDto {
    return this.toListItemDto(row);
  }
}
