export const ItemStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

export type ItemStatus = (typeof ItemStatus)[keyof typeof ItemStatus];

export const ITEM_STATUSES = Object.values(ItemStatus);
