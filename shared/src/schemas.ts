// Zod validation schemas for Better You
import { z } from 'zod';
import { HabitFrequency, HabitDifficulty, HabitCategory } from './types';

// User schemas
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
});

// Habit schemas
export const HabitSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  frequency: z.nativeEnum(HabitFrequency),
  difficulty: z.nativeEnum(HabitDifficulty),
  category: z.nativeEnum(HabitCategory),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateHabitSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  frequency: z.nativeEnum(HabitFrequency),
  difficulty: z.nativeEnum(HabitDifficulty),
  category: z.nativeEnum(HabitCategory),
});

export const UpdateHabitSchema = CreateHabitSchema.partial();

// Habit Entry schemas
export const HabitEntrySchema = z.object({
  id: z.string().uuid(),
  habitId: z.string().uuid(),
  date: z.date(),
  completed: z.boolean(),
  notes: z.string().max(500).optional(),
  mood: z.number().min(1).max(5).optional(),
  createdAt: z.date(),
});

export const CreateHabitEntrySchema = z.object({
  habitId: z.string().uuid(),
  date: z.date(),
  completed: z.boolean(),
  notes: z.string().max(500).optional(),
  mood: z.number().min(1).max(5).optional(),
});

// API schemas
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    success: z.literal(true),
    message: z.string().optional(),
  });

export const ApiErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  code: z.string().optional(),
});

// Environment schemas
export const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_BASE_URL: z.string().url(),
  DATABASE_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(32).optional(),
});

export type EnvConfig = z.infer<typeof EnvSchema>;