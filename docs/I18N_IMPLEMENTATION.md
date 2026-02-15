# Internationalization Implementation Guide

This document provides step-by-step instructions for implementing bilingual support (English + Brazilian Portuguese) in Better You.

> **Context**: This is a Phase 1 MVP requirement. All features must support both locales from launch.

---

## Implementation Phases

### Phase 1a: Shared Package Setup (Week 1)

**Goal**: Define types and utilities for i18n

#### 1. Update Shared Types

```typescript
// shared/src/types.ts - Add these types

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

// Life Domain translations (add to existing types)
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
```

#### 2. Export from Shared Package

```typescript
// shared/src/index.ts - Add exports
export type { Locale, LocalizedString } from './types';
export {
  getLocalizedString,
  LIFE_DOMAINS_I18N,
  LIFE_DOMAINS_DESCRIPTIONS
} from './types';
```

---

### Phase 1b: Mobile App Setup (Week 1-2)

**Goal**: Configure i18next and create translation files

#### 1. Install Dependencies

```bash
cd mobile
npm install i18next react-i18next expo-localization
```

#### 2. Create Directory Structure

```bash
mkdir -p mobile/locales
touch mobile/locales/en.json
touch mobile/locales/pt-BR.json
touch mobile/locales/index.ts
touch mobile/src/lib/i18n.ts
```

#### 3. Create Translation Files

**English (mobile/locales/en.json)**
```json
{
  "common": {
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit",
    "back": "Back",
    "next": "Next",
    "done": "Done",
    "error": "Error",
    "loading": "Loading..."
  },
  "onboarding": {
    "welcome": "Welcome to Better You",
    "selectLanguage": "Select your language",
    "intro": "Achieve your goals with capacity-aware planning and community support"
  },
  "lifeDomains": {
    "title": "Life Domains",
    "selectPrompt": "Select a life domain for your goal",
    "BODY": "Body",
    "MIND": "Mind",
    "RELATIONSHIPS": "Relationships",
    "WORK": "Work",
    "MONEY": "Money",
    "SERVICE": "Service",
    "SPIRITUALITY": "Spirituality"
  },
  "availability": {
    "title": "Weekly Availability",
    "subtitle": "How much time do you have each day?",
    "minutesPerDay": "minutes per day",
    "hoursPerDay": "hours per day",
    "days": {
      "monday": "Monday",
      "tuesday": "Tuesday",
      "wednesday": "Wednesday",
      "thursday": "Thursday",
      "friday": "Friday",
      "saturday": "Saturday",
      "sunday": "Sunday"
    }
  },
  "goals": {
    "active": "Active Goals",
    "queued": "Queued Goals",
    "completed": "Completed Goals",
    "createGoal": "Create Goal",
    "overloadWarning": "You're overloaded. Consider queuing this goal."
  },
  "checkin": {
    "title": "Check-in",
    "status": {
      "done": "Done",
      "partial": "Partial",
      "skipped": "Skipped"
    },
    "difficulty": {
      "easy": "Easy",
      "moderate": "Moderate",
      "hard": "Hard"
    },
    "mood": {
      "good": "Good",
      "neutral": "Neutral",
      "difficult": "Difficult"
    },
    "addNote": "Add a note (optional)",
    "submit": "Submit Check-in"
  },
  "community": {
    "liveActivity": "Live Activity",
    "boostRequest": "Boost Request",
    "requestBoost": "Request Boost",
    "reply": "Reply",
    "reactions": "Reactions"
  },
  "settings": {
    "title": "Settings",
    "language": "Language",
    "preferences": "Preferences",
    "focusWall": "Focus Wall",
    "liveCommunity": "Live Community"
  }
}
```

**Brazilian Portuguese (mobile/locales/pt-BR.json)**
```json
{
  "common": {
    "cancel": "Cancelar",
    "save": "Salvar",
    "delete": "Excluir",
    "edit": "Editar",
    "back": "Voltar",
    "next": "Próximo",
    "done": "Concluído",
    "error": "Erro",
    "loading": "Carregando..."
  },
  "onboarding": {
    "welcome": "Bem-vindo ao Better You",
    "selectLanguage": "Selecione seu idioma",
    "intro": "Alcance seus objetivos com planejamento consciente e apoio da comunidade"
  },
  "lifeDomains": {
    "title": "Domínios da Vida",
    "selectPrompt": "Selecione um domínio da vida para seu objetivo",
    "BODY": "Corpo",
    "MIND": "Mente",
    "RELATIONSHIPS": "Relacionamentos",
    "WORK": "Trabalho",
    "MONEY": "Dinheiro",
    "SERVICE": "Serviço",
    "SPIRITUALITY": "Espiritualidade"
  },
  "availability": {
    "title": "Disponibilidade Semanal",
    "subtitle": "Quanto tempo você tem disponível por dia?",
    "minutesPerDay": "minutos por dia",
    "hoursPerDay": "horas por dia",
    "days": {
      "monday": "Segunda",
      "tuesday": "Terça",
      "wednesday": "Quarta",
      "thursday": "Quinta",
      "friday": "Sexta",
      "saturday": "Sábado",
      "sunday": "Domingo"
    }
  },
  "goals": {
    "active": "Objetivos Ativos",
    "queued": "Objetivos na Fila",
    "completed": "Objetivos Concluídos",
    "createGoal": "Criar Objetivo",
    "overloadWarning": "Você está sobrecarregado. Considere colocar este objetivo na fila."
  },
  "checkin": {
    "title": "Check-in",
    "status": {
      "done": "Concluído",
      "partial": "Parcial",
      "skipped": "Pulado"
    },
    "difficulty": {
      "easy": "Fácil",
      "moderate": "Moderado",
      "hard": "Difícil"
    },
    "mood": {
      "good": "Bom",
      "neutral": "Neutro",
      "difficult": "Difícil"
    },
    "addNote": "Adicionar nota (opcional)",
    "submit": "Enviar Check-in"
  },
  "community": {
    "liveActivity": "Atividade ao Vivo",
    "boostRequest": "Pedido de Incentivo",
    "requestBoost": "Pedir Incentivo",
    "reply": "Responder",
    "reactions": "Reações"
  },
  "settings": {
    "title": "Configurações",
    "language": "Idioma",
    "preferences": "Preferências",
    "focusWall": "Muro de Foco",
    "liveCommunity": "Comunidade ao Vivo"
  }
}
```

#### 4. Configure i18next

**mobile/src/lib/i18n.ts**
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from '../../locales/en.json';
import ptBR from '../../locales/pt-BR.json';

const LOCALE_STORAGE_KEY = 'user_locale';

// Get stored locale or device locale
async function getInitialLocale(): Promise<string> {
  try {
    const stored = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored) return stored;
    
    // Fallback to device locale
    const deviceLocale = Localization.locale;
    return deviceLocale.startsWith('pt') ? 'pt-BR' : 'en';
  } catch {
    return 'en';
  }
}

// Initialize i18next
export async function initI18n() {
  const locale = await getInitialLocale();
  
  await i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        'pt-BR': { translation: ptBR }
      },
      lng: locale,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false
      }
    });
}

// Change language and persist
export async function changeLanguage(locale: 'en' | 'pt-BR') {
  await AsyncStorage.setItem(LOCALE_STORAGE_KEY, locale);
  await i18n.changeLanguage(locale);
}

export default i18n;
```

#### 5. Initialize in App Layout

**mobile/app/_layout.tsx**
```typescript
import { useEffect, useState } from 'react';
import { initI18n } from '../src/lib/i18n';

export default function RootLayout() {
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    initI18n().then(() => setI18nReady(true));
  }, []);

  if (!i18nReady) {
    return null; // Or loading screen
  }

  // Rest of layout...
}
```

#### 6. Use in Components

```typescript
import { useTranslation } from 'react-i18next';
import { Text, Button } from 'react-native';

function CheckInScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Text>{t('checkin.title')}</Text>
      <Button title={t('checkin.status.done')} />
    </>
  );
}
```

---

### Phase 1c: Backend Setup (Week 2-3)

**Goal**: Configure API i18n and database schema

#### 1. Install Dependencies

```bash
cd backend
npm install i18next i18next-fs-backend accept-language-parser
```

#### 2. Create Translation Files

**backend/locales/en.json**
```json
{
  "errors": {
    "unauthorized": "Unauthorized access",
    "notFound": "Resource not found",
    "overloadDetected": "You're at capacity. Consider queuing this goal.",
    "invalidInput": "Invalid input provided",
    "serverError": "Internal server error"
  },
  "success": {
    "goalCreated": "Goal created successfully",
    "checkInRecorded": "Check-in recorded",
    "profileUpdated": "Profile updated"
  }
}
```

**backend/locales/pt-BR.json**
```json
{
  "errors": {
    "unauthorized": "Acesso não autorizado",
    "notFound": "Recurso não encontrado",
    "overloadDetected": "Você está no limite. Considere colocar este objetivo na fila.",
    "invalidInput": "Entrada inválida fornecida",
    "serverError": "Erro interno do servidor"
  },
  "success": {
    "goalCreated": "Objetivo criado com sucesso",
    "checkInRecorded": "Check-in registrado",
    "profileUpdated": "Perfil atualizado"
  }
}
```

#### 3. Configure i18next

**backend/lib/i18n.ts**
```typescript
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { join } from 'path';

i18next
  .use(Backend)
  .init({
    backend: {
      loadPath: join(process.cwd(), 'locales/{{lng}}.json')
    },
    lng: 'en',
    fallbackLng: 'en',
    preload: ['en', 'pt-BR']
  });

export default i18next;
```

#### 4. Create Locale Middleware

**backend/lib/locale.ts**
```typescript
import { NextRequest } from 'next/server';
import acceptLanguage from 'accept-language-parser';
import type { Locale } from '@better-you/shared';

export function getLocaleFromRequest(request: NextRequest): Locale {
  const acceptLanguageHeader = request.headers.get('Accept-Language');
  
  if (!acceptLanguageHeader) return 'en';
  
  const languages = acceptLanguage.parse(acceptLanguageHeader);
  const preferredLang = languages[0]?.code;
  
  // Check if Portuguese
  if (preferredLang === 'pt') {
    return 'pt-BR';
  }
  
  return 'en';
}
```

#### 5. Use in API Routes

**backend/app/api/goals/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getLocaleFromRequest } from '@/lib/locale';
import i18next from '@/lib/i18n';

export async function POST(request: NextRequest) {
  const locale = getLocaleFromRequest(request);
  const t = i18next.getFixedT(locale);
  
  try {
    // ... create goal logic ...
    
    return NextResponse.json({
      success: true,
      message: t('success.goalCreated')
    });
  } catch (error) {
    return NextResponse.json({
      error: {
        code: 'SERVER_ERROR',
        message: t('errors.serverError')
      }
    }, { status: 500 });
  }
}
```

#### 6. Database Schema Updates

**backend/migrations/001_add_users_locale.sql**
```sql
-- Add preferred_locale to users table
ALTER TABLE users 
ADD COLUMN preferred_locale VARCHAR(10) DEFAULT 'en' CHECK (preferred_locale IN ('en', 'pt-BR'));

-- Add locale to posts (track post language)
ALTER TABLE posts
ADD COLUMN locale VARCHAR(10) NOT NULL DEFAULT 'en';

-- Update path_templates for localized content using JSONB (scalable to more languages)
ALTER TABLE path_templates
ADD COLUMN title JSONB NOT NULL DEFAULT '{"en": "", "pt-BR": ""}'::jsonb,
ADD COLUMN description JSONB NOT NULL DEFAULT '{"en": "", "pt-BR": ""}'::jsonb;

-- Note: steps_json already contains localized step content as JSONB
-- Each step should have: { title: {en: "...", "pt-BR": "..."}, description: {...} }

-- Add constraint to ensure required locales are present
ALTER TABLE path_templates
ADD CONSTRAINT title_has_required_locales 
  CHECK (title ? 'en' AND title ? 'pt-BR');

ALTER TABLE path_templates
ADD CONSTRAINT description_has_required_locales 
  CHECK (description ? 'en' AND description ? 'pt-BR');

-- Create index for locale queries
CREATE INDEX idx_users_locale ON users(preferred_locale);
CREATE INDEX idx_posts_locale ON posts(locale);

-- Create GIN indexes for JSONB text search if needed
CREATE INDEX idx_path_templates_title_gin ON path_templates USING gin(title);
CREATE INDEX idx_path_templates_description_gin ON path_templates USING gin(description);
```

---

### Phase 1d: API Integration (Week 3-4)

**Goal**: Connect mobile app to localized backend

#### 1. Update API Client

**mobile/src/lib/api.ts**
```typescript
import i18n from './i18n';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const locale = i18n.language;
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': locale,
      ...options.headers
    }
  });
  
  return response;
}

export default fetchAPI;
```

#### 2. Update React Query Hooks

**mobile/src/features/goals/useGoals.ts**
```typescript
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import fetchAPI from '@/lib/api';

export function useGoals() {
  const { i18n } = useTranslation();
  
  return useQuery({
    queryKey: ['goals', i18n.language],
    queryFn: async () => {
      const response = await fetchAPI('/api/goals');
      return response.json();
    }
  });
}
```

---

### Phase 1e: Translation Validation (Week 1-4, Ongoing)

**Goal**: Ensure translation completeness and prevent missing keys

#### 1. Create Validation Script

**shared/scripts/validate-translations.js**
```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const LOCALES = ['en', 'pt-BR'];
const MOBILE_LOCALES_DIR = path.join(__dirname, '../../mobile/locales');

function getAllKeys(obj, prefix = '') {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      keys.push(...getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function validateTranslations() {
  const translations = {};
  let hasErrors = false;

  // Load all translation files
  for (const locale of LOCALES) {
    const filePath = path.join(MOBILE_LOCALES_DIR, `${locale}.json`);
    try {
      translations[locale] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
      console.error(`❌ Error loading ${locale}.json:`, error.message);
      hasErrors = true;
      return false;
    }
  }

  // Get all keys from English (source of truth)
  const enKeys = new Set(getAllKeys(translations.en));

  // Check each locale for missing/extra keys
  for (const locale of LOCALES) {
    if (locale === 'en') continue;

    const localeKeys = new Set(getAllKeys(translations[locale]));
    
    const missingKeys = [...enKeys].filter(key => !localeKeys.has(key));
    const extraKeys = [...localeKeys].filter(key => !enKeys.has(key));

    if (missingKeys.length > 0) {
      console.error(`❌ ${locale}: Missing ${missingKeys.length} keys:`);
      missingKeys.forEach(key => console.error(`   - ${key}`));
      hasErrors = true;
    }

    if (extraKeys.length > 0) {
      console.warn(`⚠️  ${locale}: Extra ${extraKeys.length} keys (not in en):`);
      extraKeys.forEach(key => console.warn(`   - ${key}`));
    }

    if (missingKeys.length === 0 && extraKeys.length === 0) {
      console.log(`✅ ${locale}: All translations complete (${localeKeys.size} keys)`);
    }
  }

  return !hasErrors;
}

const success = validateTranslations();
process.exit(success ? 0 : 1);
```

#### 2. Create Coverage Report

**shared/scripts/translation-coverage.js**
```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const MOBILE_LOCALES_DIR = path.join(__dirname, '../../mobile/locales');

function countKeys(obj) {
  let count = 0;
  for (const value of Object.values(obj)) {
    if (typeof value === 'object' && value !== null) {
      count += countKeys(value);
    } else {
      count++;
    }
  }
  return count;
}

function generateCoverage() {
  const en = JSON.parse(fs.readFileSync(path.join(MOBILE_LOCALES_DIR, 'en.json'), 'utf8'));
  const ptBR = JSON.parse(fs.readFileSync(path.join(MOBILE_LOCALES_DIR, 'pt-BR.json'), 'utf8'));

  const enCount = countKeys(en);
  const ptBRCount = countKeys(ptBR);
  const coverage = ((ptBRCount / enCount) * 100).toFixed(1);

  console.log('\n📊 Translation Coverage Report\n');
  console.log(`English (en):           ${enCount} keys`);
  console.log(`Portuguese (pt-BR):     ${ptBRCount} keys`);
  console.log(`Coverage:               ${coverage}%`);
  
  if (coverage < 100) {
    console.log(`\n⚠️  Translation incomplete: ${enCount - ptBRCount} keys missing`);
  } else {
    console.log('\n✅ Full translation coverage achieved!');
  }
}

generateCoverage();
```

#### 3. Add npm Scripts

**package.json (workspace root)**
```json
{
  "scripts": {
    "i18n:validate": "node shared/scripts/validate-translations.js",
    "i18n:coverage": "node shared/scripts/translation-coverage.js",
    "i18n:check": "npm run i18n:validate && npm run i18n:coverage"
  }
}
```

#### 4. Add Pre-commit Hook (Optional)

**Install husky** (if not already present)
```bash
npm install --save-dev husky
npx husky init
```

**.husky/pre-commit**
```bash
#!/bin/sh
npm run i18n:validate
```

---

## Testing Checklist

### Mobile App Testing
- [ ] Device auto-detects correct locale
- [ ] Language can be switched in settings
- [ ] All screens render correctly in both languages
- [ ] No text overflow or truncation issues
- [ ] Date/time formats respect locale
- [ ] Navigation labels are translated
- [ ] Error messages appear in correct language

### Backend Testing
- [ ] API accepts Accept-Language header
- [ ] Error messages return in requested locale
- [ ] Database stores user preferred_locale
- [ ] PathTemplates return localized content from JSONB
- [ ] Missing translations fallback to English
- [ ] JSONB constraints prevent templates without required locales

### Integration Testing
- [ ] Create goal flow in Portuguese
- [ ] Check-in flow in English
- [ ] Switch language mid-session
- [ ] Offline mode preserves locale
- [ ] Push notifications in user's language

---

## Translation Workflow

### Adding New Strings

1. **Add to English first** (`mobile/locales/en.json`)
2. **Add Portuguese translation** (`mobile/locales/pt-BR.json`)
3. **Validate translations**: `npm run i18n:validate`
4. **Use in code**: `t('namespace.key')`
5. **Test both locales**

### CI/CD Integration

Add to GitHub Actions workflow:
```yaml
- name: Validate translations
  run: npm run i18n:check
```

This ensures no missing translation keys reach production.

### Translation Guidelines

**English Style:**
- Clear and concise
- Non-punitive language
- Active voice
- Encouraging tone

**Portuguese Style:**
- Use informal "você" (not "senhor/senhora")
- Warm and supportive
- Natural Brazilian Portuguese (not European)
- Avoid literal translations; prioritize cultural meaning

---

## Common Issues & Solutions

### Issue: Missing Translation Keys
**Solution**: Enable debug mode in i18next config to see missing keys in console

### Issue: Text Overflow in Portuguese
**Solution**: Portuguese text can be 20-30% longer; design with flex layouts

### Issue: Date Formatting
**Solution**: Use `Intl.DateTimeFormat` with locale parameter

### Issue: Pluralization
**Solution**: Use i18next pluralization with proper plural forms:
```json
// en.json
{
  "items": "{{count}} item",
  "items_plural": "{{count}} items"
}

// pt-BR.json (Portuguese has same plural rules as English)
{
  "items": "{{count}} item",
  "items_plural": "{{count}} itens"
}
```
Usage: `t('items', { count: 5 })`

### Issue: Adding New Languages
**Solution**: JSONB schema scales easily:
1. Add new locale to `Locale` type in shared/src/types.ts
2. Update database constraints to include new locale
3. Create new translation files (en.json as template)
4. Update validation scripts with new locale code

---

## Resources

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
- [Expo Localization](https://docs.expo.dev/versions/latest/sdk/localization/)
- [Brazilian Portuguese Style Guide](https://www.microsoft.com/pt-br/language)

---

_Last Updated: 2026-02-15_
