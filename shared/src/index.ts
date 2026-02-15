// Shared types and utilities for Better You
export * from './types';
export * from './schemas';
export * from './utils';

// Explicit i18n exports for clarity
export type { Locale, LocalizedString, LifeDomain } from './types';
export {
  getLocalizedString,
  validateTranslations,
  LIFE_DOMAINS_I18N,
  LIFE_DOMAINS_DESCRIPTIONS
} from './types';