import { pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { idColumn, timestamps } from './helpers';

export const items = pgTable('items', {
  id: idColumn(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('draft'),
  ...timestamps,
});
