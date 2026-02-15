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
