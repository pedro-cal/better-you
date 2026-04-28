import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  date,
  uuid,
  jsonb,
  unique,
} from 'drizzle-orm/pg-core';
import type { LifeDomain } from '@better-you/shared';

// ─── Users ───────────────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  preferredLocale: text('preferred_locale').notNull().default('en'),
  participationPhase: text('participation_phase').notNull().default('grace'),
  pointsBalance: integer('points_balance').notNull().default(0),
  focusWallEnabled: boolean('focus_wall_enabled').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Availability ─────────────────────────────────────────────────────────────

export const availability = pgTable('availability', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  mon: integer('mon').notNull().default(0),
  tue: integer('tue').notNull().default(0),
  wed: integer('wed').notNull().default(0),
  thu: integer('thu').notNull().default(0),
  fri: integer('fri').notNull().default(0),
  sat: integer('sat').notNull().default(0),
  sun: integer('sun').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Journeys ─────────────────────────────────────────────────────────────────

export const journeys = pgTable('journeys', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  domain: text('domain').notNull().$type<LifeDomain>(),
  title: text('title').notNull(),
  description: text('description'),
  narrative: text('narrative'),
  state: text('state').notNull().default('active'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Path Templates ───────────────────────────────────────────────────────────

export const pathTemplates = pgTable('path_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  domain: text('domain').notNull().$type<LifeDomain>(),
  stepsJson: jsonb('steps_json').notNull().default([]),
  minutesPerWeekEstimate: integer('minutes_per_week_estimate').notNull().default(0),
  tags: text('tags').array().notNull().default([]),
  difficulty: text('difficulty'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ─── Goals ────────────────────────────────────────────────────────────────────

export const goals = pgTable('goals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  journeyId: uuid('journey_id').references(() => journeys.id, {
    onDelete: 'set null',
  }),
  domain: text('domain').notNull().$type<LifeDomain>(),
  title: text('title').notNull(),
  intent: text('intent'),
  completionCriteria: text('completion_criteria'),
  state: text('state').notNull().default('draft'),
  activatedAt: timestamp('activated_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Paths (PathInstance) ─────────────────────────────────────────────────────

export const paths = pgTable('paths', {
  id: uuid('id').primaryKey().defaultRandom(),
  goalId: uuid('goal_id')
    .notNull()
    .unique()
    .references(() => goals.id, { onDelete: 'cascade' }),
  templateId: uuid('template_id').references(() => pathTemplates.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Steps (StepInstance) ─────────────────────────────────────────────────────

export const steps = pgTable('steps', {
  id: uuid('id').primaryKey().defaultRandom(),
  pathId: uuid('path_id')
    .notNull()
    .references(() => paths.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  state: text('state').notNull().default('pending'),
  type: text('type').notNull().default('recurring'),
  source: text('source').notNull().default('user'),
  order: integer('order').notNull().default(0),
  cadence: text('cadence'),
  estimatedMinutes: integer('estimated_minutes'),
  allowedWeekdays: text('allowed_weekdays').array(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Check-ins ────────────────────────────────────────────────────────────────

export const checkins = pgTable('checkins', {
  id: uuid('id').primaryKey().defaultRandom(),
  stepId: uuid('step_id')
    .notNull()
    .references(() => steps.id, { onDelete: 'cascade' }),
  date: date('date').notNull(),
  status: text('status').notNull(),
  difficulty: integer('difficulty'),
  mood: integer('mood'),
  logText: text('log_text'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [unique('checkins_step_date_uniq').on(t.stepId, t.date)]);

// ─── Checkpoints ──────────────────────────────────────────────────────────────

export const checkpoints = pgTable('checkpoints', {
  id: uuid('id').primaryKey().defaultRandom(),
  goalId: uuid('goal_id')
    .notNull()
    .references(() => goals.id, { onDelete: 'cascade' }),
  prompt1: text('prompt_1'),
  prompt2: text('prompt_2'),
  prompt3: text('prompt_3'),
  response1: text('response_1'),
  response2: text('response_2'),
  response3: text('response_3'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ─── Adjustments ──────────────────────────────────────────────────────────────

export const adjustments = pgTable('adjustments', {
  id: uuid('id').primaryKey().defaultRandom(),
  stepId: uuid('step_id')
    .notNull()
    .references(() => steps.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  reason: text('reason'),
  before: jsonb('before'),
  after: jsonb('after').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
