import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ITEM_STATUSES, ItemStatus } from '../enums/item-status.enum';

export class CreateItemDto {
  @ApiProperty({ example: 'My first item' })
  @IsNotEmpty({ message: 'title must not be empty' })
  @IsString({ message: 'title must be a string' })
  title: string;

  @ApiProperty({ example: 'A short description of the item.' })
  @IsNotEmpty({ message: 'description must not be empty' })
  @IsString({ message: 'description must be a string' })
  description: string;

  @ApiPropertyOptional({
    enum: ITEM_STATUSES,
    example: ItemStatus.DRAFT,
    default: ItemStatus.DRAFT,
  })
  @IsOptional()
  @IsIn(ITEM_STATUSES, {
    message: `status must be one of: ${ITEM_STATUSES.join(', ')}`,
  })
  status?: ItemStatus;
}
