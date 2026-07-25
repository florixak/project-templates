import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { idColumn, timestamps } from './helpers';

export const users = pgTable('users', {
  id: idColumn(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  ...timestamps,
});
