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
