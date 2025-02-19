import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  web3_wallet: text('web3_wallet').unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
