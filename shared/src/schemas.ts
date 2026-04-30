import { z } from 'zod';

// ── Core enums ────────────────────────────────────────────────────────────────

export const LifeDomainSchema = z.enum([
  'BODY', 'MIND', 'SOCIAL', 'WORK', 'MONEY', 'SERVICE', 'SPIRITUALITY',
]);

export const GoalStateSchema = z.enum([
  'draft', 'queued', 'active', 'paused', 'completed', 'abandoned', 'archived',
]);
export type GoalState = z.infer<typeof GoalStateSchema>;

export const StepStateSchema = z.enum(['pending', 'completed', 'skipped', 'retired']);
export const StepTypeSchema = z.enum(['recurring', 'one_time']);
export const CheckinStatusSchema = z.enum(['done', 'skipped', 'missed']);
export const AdjustmentTypeSchema = z.enum([
  'cadence_change', 'reschedule', 'minutes_change', 'other',
]);

// ── Auth ──────────────────────────────────────────────────────────────────────

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  password: z.string().min(8),
});

export const PatchPreferencesSchema = z.object({
  preferredLocale: z.string().optional(),
  focusWallEnabled: z.boolean().optional(),
  pushToken: z.string().optional(),
});

export const ApiUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  preferredLocale: z.string().nullable().optional(),
  focusWallEnabled: z.boolean().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type ApiUser = z.infer<typeof ApiUserSchema>;

// ── Goals ─────────────────────────────────────────────────────────────────────

export const CreateGoalSchema = z.object({
  domain: LifeDomainSchema,
  title: z.string().min(1).max(200),
  intent: z.string().max(500).optional(),
  completionCriteria: z.string().max(500).optional(),
  journeyId: z.string().uuid().optional(),
});
export type CreateGoalInput = z.infer<typeof CreateGoalSchema>;

export const PatchGoalSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  intent: z.string().max(500).nullable().optional(),
  completionCriteria: z.string().max(500).nullable().optional(),
});

export const TransitionGoalSchema = z.object({
  to: GoalStateSchema,
});

export const ApiGoalSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  journeyId: z.string().uuid().nullable(),
  domain: LifeDomainSchema,
  title: z.string(),
  intent: z.string().nullable(),
  completionCriteria: z.string().nullable(),
  state: GoalStateSchema,
  activatedAt: z.string().nullable(),
  completedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type ApiGoal = z.infer<typeof ApiGoalSchema>;

// ── Steps ─────────────────────────────────────────────────────────────────────

export const CreateStepSchema = z.object({
  title: z.string().min(1).max(200),
  type: StepTypeSchema.default('recurring'),
  cadence: z.string().optional(),
  estimatedMinutes: z.number().int().positive().optional(),
  allowedWeekdays: z.array(z.string()).optional(),
  order: z.number().int().min(0).optional(),
});

export const PatchStepSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  state: StepStateSchema.optional(),
  cadence: z.string().optional(),
  estimatedMinutes: z.number().int().positive().nullable().optional(),
  allowedWeekdays: z.array(z.string()).nullable().optional(),
  order: z.number().int().min(0).optional(),
}).refine((d) => Object.keys(d).length > 0, { message: 'No fields to update' });

export const ApiStepSchema = z.object({
  id: z.string().uuid(),
  pathId: z.string().uuid(),
  title: z.string(),
  type: StepTypeSchema,
  cadence: z.string().nullable(),
  estimatedMinutes: z.number().nullable(),
  allowedWeekdays: z.array(z.string()).nullable(),
  order: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type ApiStep = z.infer<typeof ApiStepSchema>;

// ── Check-ins ─────────────────────────────────────────────────────────────────

export const CreateCheckinSchema = z.object({
  stepId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
  status: CheckinStatusSchema,
  difficulty: z.number().int().min(1).max(5).optional(),
  mood: z.number().int().min(1).max(5).optional(),
  logText: z.string().max(1000).optional(),
});

export const ApiCheckinSchema = z.object({
  id: z.string().uuid(),
  stepId: z.string().uuid(),
  date: z.string(),
  status: CheckinStatusSchema,
  difficulty: z.number().nullable(),
  mood: z.number().nullable(),
  logText: z.string().nullable(),
  createdAt: z.string(),
});
export type ApiCheckin = z.infer<typeof ApiCheckinSchema>;

// ── Journeys ──────────────────────────────────────────────────────────────────

export const CreateJourneySchema = z.object({
  domain: LifeDomainSchema,
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  narrative: z.string().max(1000).optional(),
});

export const ApiJourneySchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  domain: LifeDomainSchema,
  title: z.string(),
  description: z.string().nullable(),
  narrative: z.string().nullable(),
  state: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type ApiJourney = z.infer<typeof ApiJourneySchema>;

// ── Checkpoints ───────────────────────────────────────────────────────────────

export const CreateCheckpointSchema = z.object({
  goalId: z.string().uuid(),
  prompt1: z.string().max(500).optional(),
  prompt2: z.string().max(500).optional(),
  prompt3: z.string().max(500).optional(),
  response1: z.string().max(2000).optional(),
  response2: z.string().max(2000).optional(),
  response3: z.string().max(2000).optional(),
});

// ── Adjustments ───────────────────────────────────────────────────────────────

export const CreateAdjustmentSchema = z.object({
  stepId: z.string().uuid(),
  type: AdjustmentTypeSchema,
  reason: z.string().max(500).optional(),
  before: z.record(z.string(), z.unknown()).optional(),
  after: z.record(z.string(), z.unknown()),
});

// ── Path templates ────────────────────────────────────────────────────────────

export const FromTemplateSchema = z.object({
  templateId: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  intent: z.string().max(500).optional(),
  completionCriteria: z.string().max(500).optional(),
  journeyId: z.string().uuid().optional(),
});
