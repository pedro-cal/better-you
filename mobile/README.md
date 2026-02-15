# Better You Mobile App

React Native mobile application for the Better You platform.

> **📖 Project Overview**: See [../README.md](../README.md) for complete project context.  
> **📋 Current Status**: See [../STATUS.md](../STATUS.md) for development phase and next steps.  
> **🏗️ Tech Stack**: See [../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) for complete technical architecture.

## Quick Start

### Setup
```bash
# From monorepo root
npm install
cd mobile
cp .env.example .env
```

### Development
```bash
npm run dev          # Start Expo dev server
npm run android      # Android emulator
npm run ios          # iOS simulator
npm run web          # Web browser
```

## Available Scripts

```bash
# Development
npm run dev           # Start Expo dev server
npm run android       # Android emulator
npm run ios           # iOS simulator

# Quality Assurance
npm run typecheck     # TypeScript check
npm run lint          # ESLint
npm run format        # Prettier
npm run test          # Jest tests
npm run verify        # All checks

# Maintenance
npm run clean         # Clean cache
npm run reset         # Reset Expo cache
```

## Environment Configuration

Copy `.env.example` to `.env`:
```env
API_BASE_URL=http://10.0.2.2:3000
APP_ENV=dev
```

Environment is validated at runtime via `src/lib/env.ts`.

## Troubleshooting

**Metro bundler issues:**
```bash
npm run reset  # Clear Expo cache
```

**TypeScript errors:**
```bash
npm run typecheck
```

**iOS build issues:**
```bash
cd ios && pod install
```

**Git hooks not working:**
```bash
cd .. && npx husky install  # From monorepo root
```

---

_Mobile-specific documentation. See [../README.md](../README.md) for project overview._