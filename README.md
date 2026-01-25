# Better You

**Better You** is a **mobile-first, AI-powered personal development platform** focused on **habit building, consistency, and adaptive coaching**.

The core problem it addresses is widely documented:  
people struggle to sustain habits over time due to motivation decay, notification fatigue, and the lack of personalized feedback.

Better You combines:
- Habit tracking
- Smart reminders
- Adaptive AI coaching
- Optional community accountability

This project is intentionally designed as:
- A **production-grade, portfolio-level system**
- A **learning vehicle for backend, infra, and AI**
- A foundation that can realistically scale to **thousands of users** and support a **freemium business model**

This repository documents both the **MVP implementation** and the **planned evolution path** toward a scalable, distributed system.

---

## Core Product Goals

1. Help users **build and sustain habits**, not just track them
2. Reduce dropout through **adaptive pacing and feedback**
3. Provide **AI coaching that supports human agency**
4. Enable **community accountability** without social overload
5. Be **extensible, observable, and scalable by design**

---

## MVP Scope

### Habit & Goal Tracking
- Create habits with schedules, difficulty, and intent
- Daily check-ins
- Streaks and progress visualization
- Flexible goal adjustments (frequency, rest days, intensity)

### AI Coaching (MVP)
- Contextual feedback based on recent activity
- Suggestions when consistency drops
- Natural language coaching interactions
- Implemented inside the backend (async-safe)

### Notifications & Feedback
- Smart, adaptive reminders
- Weekly summaries and reflections
- Push notifications as the primary re-engagement channel

### Community (MVP-light)
- Small groups or challenges
- Lightweight reinforcement
- No feeds, likes, or engagement traps

---

## Tech Stack (MVP)

### Mobile App
- React Native + Expo
- Offline-friendly where useful
- Push notifications via Expo

### Backend
- Next.js (App Router, API Routes)
- Hosted on Vercel
- REST/JSON APIs

### Database
- Postgres
- Schema-first, migration-driven

### AI
- Vercel AI SDK
- Async-friendly orchestration

---

## Repository Structure

This is a monorepo containing all Better You components:

```
better-you/
├── mobile/                 # React Native mobile app
│   ├── app/               # Expo Router screens
│   ├── src/               # Mobile app source code
│   ├── components/        # UI components
│   ├── assets/            # Static assets
│   └── package.json       # Mobile dependencies
├── backend/               # Next.js API (future)
│   ├── app/               # Next.js App Router
│   ├── lib/               # Backend utilities
│   └── package.json       # Backend dependencies
├── shared/                # Shared types and utilities
│   ├── src/
│   │   ├── types.ts       # TypeScript definitions
│   │   ├── schemas.ts     # Zod validation schemas
│   │   └── utils.ts       # Common utilities
│   └── package.json       # Shared dependencies
├── docs/                  # Project documentation
└── package.json           # Workspace configuration
```

---

## Quick Start

> **🤖 For AI Agents**: See [`STATUS.md`](STATUS.md) for comprehensive project status, current phase, and implementation guidance.

### Prerequisites

1. **Node.js 20.11.1** (managed via nvm):
   ```bash
   nvm install 20.11.1
   nvm use 20.11.1
   ```

2. **npm** (comes with Node.js):
   ```bash
   npm --version  # Should be 10.x or higher
   ```

3. **Mobile Development** (choose one):
   - **Expo Go app** on your phone (easiest)
   - **Android Studio** with Android SDK Platform 34 + ANDROID_HOME set
   - **Xcode** for iOS development (macOS only)

### Installation

1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd better-you
   npm install
   ```

2. **Start mobile development**:
   ```bash
   npm run mobile:dev
   # or
   cd mobile && npm run dev
   ```

3. **Test on device**:
   - Scan QR code with Expo Go app
   - Or run `npm run android` / `npm run ios` for emulators

---

## Available Scripts

### Workspace Level
```bash
# Development
npm run dev              # Start mobile app
npm run mobile:dev       # Start mobile app
npm run backend:dev      # Start backend (future)

# Quality Assurance
npm run test             # Run all tests
npm run lint             # Lint all packages
npm run typecheck        # TypeScript check all packages
npm run format           # Format all packages
npm run verify           # Run all quality checks

# Maintenance
npm run clean            # Clean all packages
```

### Mobile App Specific
```bash
cd mobile

# Development
npm run dev              # Start Expo dev server
npm run android          # Start on Android emulator
npm run ios              # Start on iOS simulator
npm run web              # Start web version

# Quality Assurance
npm run test             # Run Jest tests
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run typecheck        # TypeScript check
npm run verify           # Run all checks

# Maintenance
npm run clean            # Clean cache and node_modules
npm run reset            # Reset Expo cache
```

---

## Architecture

### Mobile App Architecture

The mobile app follows a **feature-based architecture** with clear separation of concerns:

- **`/app`**: Navigation and routing (Expo Router)
- **`/src/features`**: Business logic grouped by feature
- **`/components`**: Reusable UI components
- **`/src/lib`**: Utilities and external service integrations

#### Key Technologies
- **React Native 0.79.5** with **Expo SDK 53**
- **TypeScript** for type safety
- **React Query** for server state management
- **MMKV** for high-performance local storage
- **Zod** for runtime validation
- **Expo Notifications** for push notifications

#### State Management
- **Server State**: React Query for API data, caching, and synchronization
- **Local State**: React hooks for component state
- **Persistent Storage**: MMKV for settings and offline data
- **Shared State**: Shared package for common types and utilities

### Development Principles

1. **Type Safety First**: All external data validated with Zod schemas
2. **Performance Optimized**: MMKV storage, React Query caching, minimal re-renders
3. **Offline-Friendly**: Local storage with sync capabilities
4. **Developer Experience**: Hot reloading, comprehensive linting, pre-commit hooks

---

## Development Workflow

### Adding a New Feature

1. **Create feature directory**:
   ```
   mobile/src/features/[feature-name]/
   ├── index.ts                    # Export barrel
   ├── use[Feature].ts            # React Query hooks
   ├── [Feature]Screen.tsx        # Main component
   ├── components/                # Feature-specific components
   └── __tests__/                 # Feature tests
   ```

2. **Add route** in `mobile/app/` directory:
   ```typescript
   // mobile/app/[feature-name].tsx
   import { [Feature]Screen } from "@/src/features/[feature-name]";
   export default [Feature]Screen;
   ```

3. **Use shared types**:
   ```typescript
   import { Habit, HabitEntry } from "@better-you/shared";
   ```

### Best Practices

#### ✅ Do
- Group code by feature, not by file type
- Use shared types from `@better-you/shared`
- Validate API responses with Zod schemas
- Keep components small and focused
- Use React Query for all server state

#### ❌ Don't
- Put business logic in UI components
- Create deeply nested folder structures
- Skip validation for external data
- Use `any` types

---

## Testing Strategy

### Current Setup
- **Jest** with `jest-expo` preset
- **React Native Testing Library** for component testing
- **@testing-library/jest-native** for custom matchers

### Test Structure
```
mobile/src/features/[feature]/__tests__/
├── [feature].test.tsx      # Component tests
├── [feature].hook.test.ts  # Hook tests
└── [feature].utils.test.ts # Utility tests
```

---

## Project Roadmap

### Phase 1: MVP Foundation ✅ (Current)
- [x] Mobile app scaffolding with Expo Router
- [x] Monorepo structure with shared types
- [x] Development tooling and CI/CD
- [x] Basic habits feature skeleton

### Phase 2: Backend Implementation (Next)
- [ ] Next.js API with App Router
- [ ] Postgres database schema
- [ ] User authentication system
- [ ] Habit management APIs
- [ ] AI integration foundation

### Phase 3: Core Features
- [ ] Complete habit tracking flow
- [ ] Push notification system
- [ ] Basic AI coaching
- [ ] Data synchronization
- [ ] User onboarding

### Phase 4: Advanced Features
- [ ] Community features
- [ ] Advanced AI coaching
- [ ] Analytics and insights
- [ ] Premium features

---

## Why This Project Exists

Better You is not a toy app.

It exists to:
- Demonstrate **real-world system design**
- Practice **backend, infra, and AI integration**
- Serve as a **credible portfolio artifact**
- Grow incrementally without premature complexity

Every technical choice is intentional.

---

## Contributing

### Development Setup
1. Follow the Quick Start guide above
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes with tests
4. Run quality checks: `npm run verify`
5. Submit a pull request

### Commit Convention
We use [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `refactor:` code refactoring
- `test:` adding tests
- `chore:` maintenance tasks

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

_This README reflects the current architecture as of 2026-01-25. Keep it updated as the project evolves._