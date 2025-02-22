import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').notNull().default('user'),
  web3_wallet: text('web3_wallet').unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const students = pgTable('students', {
  enrolment_id: serial('enrolment_id').primaryKey(),
  user_id: text('user_id')
    .notNull()
    .references(() => users.id),
  name: text('name').notNull(),
  email: text('email').notNull(),
  hexcode: text('hexcode').notNull().unique(),
  admin: text('admin').notNull().default('false'),
  wallet_address: text('wallet_address').unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const verifiers = pgTable('verifiers', {
  id: serial('id').primaryKey(),
  verifier_id: text('verifier_id').notNull().unique(),
  user_id: text('user_id')
    .notNull()
    .references(() => users.id),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  university_name: text('university_name'),
  web3_wallet: text('web3_wallet').unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
