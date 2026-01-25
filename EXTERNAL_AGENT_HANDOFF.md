# Better You - External AI Agent Handoff

**Copy-paste this entire document to external AI agents for complete project context.**

---

## 🎯 PROJECT OVERVIEW

**Better You** is a mobile-first, AI-powered personal development platform focused on habit building, consistency, and adaptive coaching. This is a production-grade, portfolio-level system designed to scale from MVP to thousands of users.

**Current Status**: Phase 0 Complete → Phase 1 Ready  
**Your Mission**: Implement Phase 1 MVP Core features  
**Timeline**: 4-6 weeks estimated  

---

## 🏗️ REPOSITORY STRUCTURE

```
better-you/                    # Root monorepo
├── mobile/                    # React Native app (Expo SDK 53)
│   ├── app/                  # Expo Router screens
│   │   ├── (tabs)/           # Tab navigation
│   │   ├── _layout.tsx       # Root layout with providers
│   │   └── habits.tsx        # Sample habit screen
│   ├── src/
│   │   ├── features/         # Feature-based architecture
│   │   │   └── habits/       # Habits feature with useHabits hook
│   │   ├── lib/              # Utilities (env.ts, notifications.ts)
│   │   ├── state/            # React Query configuration
│   │   └── styles/           # Design tokens
│   ├── components/           # Reusable UI components
│   ├── assets/               # Static assets
│   └── package.json          # Mobile dependencies
├── backend/                   # Next.js API (NEEDS TO BE CREATED)
├── shared/                    # Common types and utilities
│   ├── src/
│   │   ├── types.ts          # User, Habit, HabitEntry types
│   │   ├── schemas.ts        # Zod validation schemas
│   │   ├── utils.ts          # Date handling, streak calculation
│   │   └── index.ts          # Export barrel
│   └── package.json          # Shared package config
├── docs/
│   ├── ARCHITECTURE.md       # Technical architecture
│   └── ROADMAP.md           # Development phases
├── .github/workflows/        # CI/CD pipeline
├── package.json              # Workspace configuration (npm workspaces)
└── STATUS.md                 # Internal project status
```

---

## 📋 CURRENT PHASE: PHASE 1 - MVP CORE

**Goal**: Deliver core habit tracking functionality to first users  
**Success Criteria**: 10 beta users, 7-day retention >50%, offline functionality  

### IMMEDIATE TASKS TO IMPLEMENT

#### 1. Backend Foundation (PRIORITY 1)
```bash
# Create backend directory structure:
backend/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── habits/
│   │   └── users/
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── db.ts         # Database connection
│   ├── auth.ts       # Authentication helpers
│   └── validation.ts # Zod schema validation
├── package.json
├── tsconfig.json
└── next.config.js
```

#### 2. Database Schema (PostgreSQL)
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Habits table
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  frequency VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'custom'
  difficulty VARCHAR(20) NOT NULL, -- 'easy', 'medium', 'hard'
  category VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Habit Entries table
CREATE TABLE habit_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES habits(id),
  date DATE NOT NULL,
  completed BOOLEAN NOT NULL,
  notes TEXT,
  mood INTEGER CHECK (mood >= 1 AND mood <= 5),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(habit_id, date)
);

-- Background Jobs table
CREATE TABLE background_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,
  payload JSONB,
  status VARCHAR(20) DEFAULT 'pending',
  scheduled_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. Core API Endpoints to Create
```typescript
// backend/app/api/habits/route.ts
GET    /api/habits          # Get user's habits
POST   /api/habits          # Create new habit

// backend/app/api/habits/[id]/route.ts  
GET    /api/habits/[id]     # Get specific habit
PUT    /api/habits/[id]     # Update habit
DELETE /api/habits/[id]     # Delete habit

// backend/app/api/habits/[id]/entries/route.ts
GET    /api/habits/[id]/entries     # Get habit entries
POST   /api/habits/[id]/entries     # Create habit entry

// backend/app/api/auth/route.ts
POST   /api/auth/register   # User registration
POST   /api/auth/login      # User login
```

---

## 🔧 TECHNICAL STACK

### Mobile App (Already Implemented)
- **React Native 0.79.5** + **Expo SDK 53**
- **TypeScript 5.9.2** with strict mode
- **Expo Router** for file-based navigation
- **TanStack React Query** for server state
- **MMKV** for local storage
- **Zod** for validation

### Backend (To Implement)
- **Next.js 15+** with App Router
- **TypeScript** with shared types
- **PostgreSQL** database
- **Vercel AI SDK** for coaching
- **Zod** validation from shared package

### Shared Package (Already Implemented)
```typescript
// Available types from @better-you/shared
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Habit {
  id: string;
  userId: string;
  title: string;
  description?: string;
  frequency: HabitFrequency; // 'daily' | 'weekly' | 'custom'
  difficulty: HabitDifficulty; // 'easy' | 'medium' | 'hard'
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

// Zod schemas available for validation
export const CreateHabitSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  frequency: z.nativeEnum(HabitFrequency),
  difficulty: z.nativeEnum(HabitDifficulty),
  category: z.nativeEnum(HabitCategory),
});
```

---

## 🎯 ARCHITECTURAL PRINCIPLES (CRITICAL)

1. **Mobile-First**: All decisions prioritize mobile experience
2. **Modular Monolith**: Start organized, decompose only when needed
3. **Async-First**: External operations are non-blocking
4. **Type Safety**: Use shared types, validate with Zod
5. **Ship Fast, Scale Smart**: Add complexity only when usage demands it

### Quality Gates (MUST FOLLOW)
- All TypeScript checks must pass
- ESLint and Prettier formatting enforced
- Use shared types from `@better-you/shared`
- Validate all API inputs with Zod schemas
- Mobile app must work offline-first
- Conventional commits required

---

## 🤖 DEVELOPMENT COMMANDS

```bash
# Setup (run from project root)
npm install                    # Install all workspace dependencies

# Mobile development
cd mobile && npm run dev       # Start mobile app
npm run android               # Test on Android
npm run ios                   # Test on iOS

# Backend development (once created)
cd backend && npm run dev      # Start Next.js server

# Quality checks
npm run typecheck             # TypeScript check all packages
npm run lint                  # Lint all packages
npm run test                  # Run tests
```

---

## 📝 IMPLEMENTATION WORKFLOW

### Step 1: Create Next.js Backend
```bash
# In backend/ directory, create:
1. package.json with Next.js, TypeScript, @better-you/shared
2. next.config.js with TypeScript support
3. tsconfig.json extending shared types
4. app/layout.tsx and app/page.tsx
5. Database connection in lib/db.ts
```

### Step 2: Implement Habit APIs
```bash
# Create API routes:
1. app/api/habits/route.ts (GET, POST)
2. app/api/habits/[id]/route.ts (GET, PUT, DELETE)  
3. app/api/habits/[id]/entries/route.ts (GET, POST)
4. Use Zod schemas for validation
5. Return consistent API response format
```

### Step 3: Connect Mobile App
```bash
# Update mobile app:
1. Replace mock data in src/features/habits/useHabits.ts
2. Add API base URL to mobile/.env
3. Create React Query hooks for all endpoints
4. Test offline functionality with React Query cache
```

### Step 4: Add Authentication
```bash
# Basic auth implementation:
1. Create app/api/auth/register/route.ts
2. Create app/api/auth/login/route.ts
3. Add JWT token handling
4. Prepare for Auth0/Clerk integration later
```

---

## 🔍 KEY FILES TO UNDERSTAND

### Mobile App Structure
- `mobile/app/_layout.tsx` - Root layout with React Query provider
- `mobile/src/features/habits/useHabits.ts` - Habit data fetching hook (currently mock)
- `mobile/src/state/query.ts` - React Query configuration
- `mobile/src/lib/env.ts` - Environment validation

### Shared Package
- `shared/src/types.ts` - All TypeScript definitions
- `shared/src/schemas.ts` - Zod validation schemas
- `shared/src/utils.ts` - Utility functions (streak calculation, etc.)

### Configuration
- Root `package.json` - npm workspaces configuration
- `mobile/package.json` - Mobile app dependencies
- `.github/workflows/ci.yml` - CI/CD pipeline

---

## ⚠️ CRITICAL SUCCESS FACTORS

### Must Haves for Phase 1
1. **End-to-end habit flow**: Create habit → daily check-in → view progress
2. **Offline functionality**: Mobile app works without network
3. **Type safety**: Shared types between mobile and backend
4. **Data validation**: All API inputs validated with Zod
5. **Real-time sync**: React Query handles cache invalidation

### Quality Standards
- No `any` types allowed
- All API responses must match shared type definitions
- Mobile app must handle loading/error states
- Database queries must be parameterized (no SQL injection)
- All user inputs must be validated

---

## 🎯 YOUR NEXT ACTIONS

1. **Create backend directory structure** with Next.js and TypeScript
2. **Set up PostgreSQL database** with the provided schema
3. **Implement habit CRUD APIs** using shared types and Zod validation
4. **Update mobile app** to use real APIs instead of mock data
5. **Test end-to-end flow** from mobile app to database

**Success Indicator**: A user can create a habit on mobile, see it persist in the database, and complete daily check-ins that calculate streaks correctly.

---

**🚀 Ready to begin? Start with creating the backend directory structure and Next.js configuration. The mobile app foundation is solid and ready for API integration.**