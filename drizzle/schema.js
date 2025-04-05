import { pgTable, serial, uuid, decimal, text, date, timestamp } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'income' or 'expense'
  createdAt: timestamp('created_at').defaultNow(),
});

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  type: text('type').notNull(), // 'income' or 'expense'
  categoryId: serial('category_id'),
  description: text('description'),
  date: date('date').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});