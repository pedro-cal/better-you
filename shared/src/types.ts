// Shared TypeScript types for Better You

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Habit types
export interface Habit {
  id: string;
  userId: string;
  title: string;
  description?: string;
  frequency: HabitFrequency;
  difficulty: HabitDifficulty;
  category: HabitCategory;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HabitEntry {
  id: string;
  habitId: string;
  date: Date;
  completed: boolean;
  notes?: string;
  mood?: number; // 1-5 scale
  createdAt: Date;
}

// Enums
export enum HabitFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  CUSTOM = 'custom'
}

export enum HabitDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum HabitCategory {
  HEALTH = 'health',
  FITNESS = 'fitness',
  PRODUCTIVITY = 'productivity',
  LEARNING = 'learning',
  SOCIAL = 'social',
  MINDFULNESS = 'mindfulness',
  CREATIVITY = 'creativity',
  OTHER = 'other'
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
}

// Streak types
export interface Streak {
  habitId: string;
  current: number;
  longest: number;
  lastCompletedDate?: Date;
}