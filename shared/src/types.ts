// Shared TypeScript types for Better You

// ============================================
// i18n Types
// ============================================

export type Locale = 'en' | 'pt-BR';

// Flexible type that scales to additional languages
export type LocalizedString = Record<Locale, string>;

// Helper function
export function getLocalizedString(
  localized: LocalizedString,
  locale: Locale
): string {
  return localized[locale] || localized.en;
}

// Validation helper for ensuring complete translations
export function validateTranslations(obj: LocalizedString): boolean {
  const requiredLocales: Locale[] = ['en', 'pt-BR'];
  return requiredLocales.every(locale => 
    obj[locale] && obj[locale].trim().length > 0
  );
}

// ============================================
// Life Domains (Product-specific types)
// ============================================

export type LifeDomain = 
  | 'BODY'
  | 'MIND'
  | 'RELATIONSHIPS'
  | 'WORK'
  | 'MONEY'
  | 'SERVICE'
  | 'SPIRITUALITY';

// Life Domain translations
export const LIFE_DOMAINS_I18N: Record<LifeDomain, LocalizedString> = {
  BODY: {
    en: 'Body',
    'pt-BR': 'Corpo'
  },
  MIND: {
    en: 'Mind',
    'pt-BR': 'Mente'
  },
  RELATIONSHIPS: {
    en: 'Relationships',
    'pt-BR': 'Relacionamentos'
  },
  WORK: {
    en: 'Work',
    'pt-BR': 'Trabalho'
  },
  MONEY: {
    en: 'Money',
    'pt-BR': 'Dinheiro'
  },
  SERVICE: {
    en: 'Service',
    'pt-BR': 'Serviço'
  },
  SPIRITUALITY: {
    en: 'Spirituality',
    'pt-BR': 'Espiritualidade'
  }
};

// Life Domain descriptions
export const LIFE_DOMAINS_DESCRIPTIONS: Record<LifeDomain, LocalizedString> = {
  BODY: {
    en: 'Physical health, fitness, nutrition, movement, sleep, and bodily care',
    'pt-BR': 'Saúde física, exercícios, nutrição, movimento, sono e cuidados corporais'
  },
  MIND: {
    en: 'Learning, creativity, cognitive development, mental clarity, and intellectual growth',
    'pt-BR': 'Aprendizado, criatividade, desenvolvimento cognitivo, clareza mental e crescimento intelectual'
  },
  RELATIONSHIPS: {
    en: 'Family, friendships, intimate partnerships, social connection, and relational health',
    'pt-BR': 'Família, amizades, parcerias íntimas, conexão social e saúde relacional'
  },
  WORK: {
    en: 'Career, professional development, meaningful occupation, and vocational identity',
    'pt-BR': 'Carreira, desenvolvimento profissional, ocupação significativa e identidade vocacional'
  },
  MONEY: {
    en: 'Financial stability, planning, literacy, resource management, and economic security',
    'pt-BR': 'Estabilidade financeira, planejamento, educação financeira, gestão de recursos e segurança econômica'
  },
  SERVICE: {
    en: 'Contribution to others, community engagement, volunteering, and prosocial action',
    'pt-BR': 'Contribuição aos outros, engajamento comunitário, voluntariado e ação pró-social'
  },
  SPIRITUALITY: {
    en: 'Values, meaning-making, reflection, faith (if present), transcendence, and existential well-being',
    'pt-BR': 'Valores, busca de significado, reflexão, fé (se presente), transcendência e bem-estar existencial'
  }
};

// ============================================
// User types
// ============================================
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

// ============================================
// Step/Task types
// ============================================

export type StepStatus = 'TODO' | 'IN_PROGRESS' | 'PARTIAL' | 'DONE' | 'SKIPPED';

export interface Step {
  id: string;
  title: string;
  goalTitle?: string;
  duration?: string; // e.g., "45m", "30m"
  progress?: number; // 0-100
  status: StepStatus;
  completionCount?: number; // For steps done multiple times (e.g., "DONE 17X")
}

export interface DailyProgress {
  completed: number;
  total: number;
}

// ============================================
// Domain Stats types
// ============================================

export interface DomainStats {
  domain: LifeDomain;
  activeGoals: number;
  completionPercentage: number;
}

export interface AllDomainStats {
  totalActiveGoals: number;
  overallCompletion: number;
}