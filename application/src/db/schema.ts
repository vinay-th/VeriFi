import { pgTable, text, serial, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  web3_wallet: text('web3_wallet').unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
