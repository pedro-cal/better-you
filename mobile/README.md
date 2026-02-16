# Better You Mobile App

React Native mobile application for the Better You platform.

> **📖 Project Overview**: See [../README.md](../README.md) for complete project context.  
> **📋 Current Status**: See [../STATUS.md](../STATUS.md) for development phase and next steps.  
> **🏗️ Tech Stack**: See [../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) for complete technical architecture.

## Quick Start

### Setup
```bash
# From monorepo root
pnpm install
cd mobile
cp .env.example .env
```

### Development
```bash
pnpm dev             # Start Expo dev server
pnpm android         # Android emulator
pnpm ios             # iOS simulator
pnpm web             # Web browser
```

## Available Scripts

```bash
# Development
pnpm dev              # Start Expo dev server
pnpm android          # Android emulator
pnpm ios              # iOS simulator

# Quality Assurance
pnpm typecheck        # TypeScript check
pnpm lint             # ESLint
pnpm format           # Prettier
pnpm test             # Jest tests
pnpm verify           # All checks

# Maintenance
pnpm clean            # Clean cache
pnpm reset            # Reset Expo cache
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
pnpm reset  # Clear Expo cache
```

**TypeScript errors:**
```bash
pnpm typecheck
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