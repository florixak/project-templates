import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ITEM_STATUSES, ItemStatus } from '../enums/item-status.enum';

const SORTABLE_FIELDS = ['title', 'status', 'createdAt'] as const;

export class ItemQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by title (case-insensitive contains)',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ enum: ITEM_STATUSES })
  @IsOptional()
  @IsIn(ITEM_STATUSES, {
    message: `status must be one of: ${ITEM_STATUSES.join(', ')}`,
  })
  status?: ItemStatus;

  @ApiPropertyOptional({ enum: SORTABLE_FIELDS, default: 'createdAt' })
  @IsOptional()
  @IsIn(SORTABLE_FIELDS, {
    message: `sortBy must be one of: ${SORTABLE_FIELDS.join(', ')}`,
  })
  declare sortBy?: (typeof SORTABLE_FIELDS)[number];
}
