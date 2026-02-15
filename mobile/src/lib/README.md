# Lib Directory

Shared utilities and configuration for the mobile app.

## i18n Usage

### Basic Usage in Components

```typescript
import { useTranslation } from 'react-i18next';
import { Text, Button } from 'react-native';

function ExampleScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Text>{t('common.loading')}</Text>
      <Button title={t('common.save')} onPress={handleSave} />
    </>
  );
}
```

### Changing Language

```typescript
import { changeLanguage } from '@/src/lib/i18n';

// Switch to Portuguese
await changeLanguage('pt-BR');

// Switch to English
await changeLanguage('en');
```

### Accessing Current Language

```typescript
import { useTranslation } from 'react-i18next';

function LanguageSelector() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language; // 'en' or 'pt-BR'
  
  return (
    <Text>Current: {currentLanguage}</Text>
  );
}
```

### Using Shared Life Domain Translations

```typescript
import { LIFE_DOMAINS_I18N, getLocalizedString } from '@better-you/shared';
import { useTranslation } from 'react-i18next';

function LifeDomainSelector() {
  const { i18n } = useTranslation();
  const locale = i18n.language as 'en' | 'pt-BR';
  
  const bodyText = getLocalizedString(LIFE_DOMAINS_I18N.BODY, locale);
  
  return <Text>{bodyText}</Text>; // "Body" or "Corpo"
}
```

## Translation Files

Translation keys are located in:
- `/mobile/locales/en.json` - English translations
- `/mobile/locales/pt-BR.json` - Brazilian Portuguese translations

Run `npm run i18n:check` from the workspace root to validate translations.
