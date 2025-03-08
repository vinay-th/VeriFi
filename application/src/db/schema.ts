import {
  pgTable,
  serial,
  text,
  timestamp,
  integer as pgInt,
  varchar,
} from 'drizzle-orm/pg-core';

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
  verifier: text('verifier').notNull().default('false'),
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

export const documents = pgTable('documents', {
  document_id: serial('document_id').primaryKey(),
  student_id: pgInt('student_id')
    .notNull()
    .references(() => students.enrolment_id),
  ipfs_hash: text('ipfs_hash').notNull().unique(),
  url: text('url').notNull().unique(),
  verifier_id: text('verifier_id')
    .notNull()
    .references(() => verifiers.verifier_id),
  document_name: text('document_name').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  status: text('status').notNull().default('pending'),
  metadata: text('metadata'),
});

export const organizations = pgTable('organizations', {
  organization_id: serial('organization_id').primaryKey(),
  user_id: text('user_id')
    .notNull()
    .references(() => users.id),
  organization_name: text('organization_name').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  web3_wallet: text('web3_wallet').unique(),
});

export const access = pgTable('access', {
  access_id: serial('id').primaryKey(),
  student_id: pgInt('student_id')
    .notNull()
    .references(() => students.enrolment_id),
  organization_id: pgInt('organization_id')
    .notNull()
    .references(() => organizations.organization_id),
  document_id: pgInt('document_id')
    .notNull()
    .references(() => documents.document_id),
  hexcode: text('hexcode').notNull(),
  request_time: timestamp('created_at').notNull().defaultNow(),
  access_duration: text('access_duration').notNull(),
  status: text('status').notNull().default('pending'),
  access_type: text('access_type').notNull(),
});

export const access_requests = pgTable('access_requests', {
  request_id: varchar('request_id').primaryKey(),
  document_id: serial('document_id').references(() => documents.document_id),
  organization_id: serial('organization_id').references(
    () => organizations.organization_id
  ),
  student_id: serial('student_id').references(() => students.enrolment_id),
  status: varchar('status').default('pending'),
  requested_at: timestamp('requested_at').defaultNow(),
  expires_at: timestamp('expires_at'),
  duration_hours: serial('duration_hours'),
});
