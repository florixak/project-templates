import { ApiProperty } from '@nestjs/swagger';
import { ItemStatus } from '../enums/item-status.enum';

export class ItemListItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'My first item' })
  title: string;

  @ApiProperty({ example: 'A short description.' })
  description: string;

  @ApiProperty({ enum: ['draft', 'published', 'archived'], example: 'draft' })
  status: ItemStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ItemDetailDto extends ItemListItemDto {}
