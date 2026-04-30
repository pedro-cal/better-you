// Shared TypeScript types for Better You

// ============================================
// i18n Types
// ============================================

export type Locale = 'en' | 'pt-BR';

export type LocalizedString = Record<Locale, string>;

export function getLocalizedString(localized: LocalizedString, locale: Locale): string {
  return localized[locale] || localized.en;
}

export function validateTranslations(obj: LocalizedString): boolean {
  const requiredLocales: Locale[] = ['en', 'pt-BR'];
  return requiredLocales.every((locale) => obj[locale] && obj[locale].trim().length > 0);
}

// ============================================
// Life Domains
// ============================================

export type LifeDomain =
  | 'BODY'
  | 'MIND'
  | 'SOCIAL'
  | 'WORK'
  | 'MONEY'
  | 'SERVICE'
  | 'SPIRITUALITY';

export const LIFE_DOMAINS_I18N: Record<LifeDomain, LocalizedString> = {
  BODY: { en: 'Body', 'pt-BR': 'Corpo' },
  MIND: { en: 'Mind', 'pt-BR': 'Mente' },
  SOCIAL: { en: 'Social', 'pt-BR': 'Social' },
  WORK: { en: 'Work', 'pt-BR': 'Trabalho' },
  MONEY: { en: 'Money', 'pt-BR': 'Dinheiro' },
  SERVICE: { en: 'Service', 'pt-BR': 'Serviço' },
  SPIRITUALITY: { en: 'Spirituality', 'pt-BR': 'Espiritualidade' },
};

export const LIFE_DOMAINS_DESCRIPTIONS: Record<LifeDomain, LocalizedString> = {
  BODY: {
    en: 'Physical health, fitness, nutrition, movement, sleep, and bodily care',
    'pt-BR': 'Saúde física, exercícios, nutrição, movimento, sono e cuidados corporais',
  },
  MIND: {
    en: 'Learning, creativity, cognitive development, mental clarity, and intellectual growth',
    'pt-BR':
      'Aprendizado, criatividade, desenvolvimento cognitivo, clareza mental e crescimento intelectual',
  },
  SOCIAL: {
    en: 'Family, friendships, intimate partnerships, social connection, and relational health',
    'pt-BR': 'Família, amizades, parcerias íntimas, conexão social e saúde relacional',
  },
  WORK: {
    en: 'Career, professional development, meaningful occupation, and vocational identity',
    'pt-BR':
      'Carreira, desenvolvimento profissional, ocupação significativa e identidade vocacional',
  },
  MONEY: {
    en: 'Financial stability, planning, literacy, resource management, and economic security',
    'pt-BR':
      'Estabilidade financeira, planejamento, educação financeira, gestão de recursos e segurança econômica',
  },
  SERVICE: {
    en: 'Contribution to others, community engagement, volunteering, and prosocial action',
    'pt-BR': 'Contribuição aos outros, engajamento comunitário, voluntariado e ação pró-social',
  },
  SPIRITUALITY: {
    en: 'Values, meaning-making, reflection, faith (if present), transcendence, and existential well-being',
    'pt-BR':
      'Valores, busca de significado, reflexão, fé (se presente), transcendência e bem-estar existencial',
  },
};

// ============================================
// User
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// API response envelope
// ============================================

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

// ============================================
// Step / Home screen types
// ============================================

export type StepStatus = 'TODO' | 'IN_PROGRESS' | 'PARTIAL' | 'DONE' | 'SKIPPED';

export interface Step {
  id: string;
  title: string;
  goalTitle?: string;
  duration?: string;
  progress?: number;
  status: StepStatus;
  completionCount?: number;
}

export interface DailyProgress {
  completed: number;
  total: number;
}

// ============================================
// Domain Stats
// ============================================

export interface DomainStats {
  domain: LifeDomain;
  activeGoals: number;
  completionPercentage: number;
  onTrack: number;
  drifting: number;
  atRisk: number;
}

export interface AllDomainStats {
  totalActiveGoals: number;
  overallCompletion: number;
  onTrack: number;
  drifting: number;
  atRisk: number;
}
