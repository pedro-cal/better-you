# Better You Mobile App

The React Native mobile application for the Better You personal development platform.

> **📋 Project Status**: See [`../STATUS.md`](../STATUS.md) for current development phase and overall project context.

## Overview

This is a modern React Native mobile app built with Expo, TypeScript, and a carefully curated set of libraries for scalable development. It's part of the Better You monorepo.

## Tech Stack

- **Framework**: Expo SDK 53 with React Native 0.79.5
- **Language**: TypeScript for type safety
- **Navigation**: Expo Router (file-based routing)
- **State Management**: TanStack React Query for server state
- **Storage**: React Native MMKV for high-performance local storage
- **Validation**: Zod for runtime type validation
- **Notifications**: Expo Notifications
- **Styling**: React Native with design tokens

## Project Structure

```
mobile/
├── app/                    # Expo Router navigation (file-based routing)
│   ├── (tabs)/            # Tab navigation layout
│   ├── _layout.tsx        # Root layout with providers
│   └── habits.tsx         # Sample feature screen
├── src/                   # Application source code
│   ├── components/        # Reusable UI components
│   ├── features/          # Feature-specific code
│   │   └── habits/        # Sample habits feature
│   ├── lib/              # Utilities and services
│   │   ├── env.ts        # Environment configuration
│   │   └── notifications.ts # Notification setup
│   ├── state/            # State management
│   │   └── query.ts      # React Query client
│   └── styles/           # Design system
│       └── tokens.ts     # Design tokens
├── components/           # Legacy components (to be moved)
├── constants/            # App constants
├── assets/              # Static assets
└── package.json         # Mobile app dependencies
```

## Quick Start

### Prerequisites

1. **Node.js 20.11.1** (managed via nvm)
2. **Mobile Development** (choose one):
   - **Expo Go app** on your phone (easiest)
   - **Android Studio** with Android SDK Platform 34
   - **Xcode** for iOS development (macOS only)

### Installation

From the monorepo root:
```bash
npm install
cd mobile
cp .env.example .env
```

### Development

```bash
# Start development server
npm run dev

# Platform-specific development
npm run android       # Android emulator
npm run ios           # iOS simulator
npm run web           # Web browser
```

## Available Scripts

```bash
# Development
npm run dev           # Start Expo dev server
npm run android       # Start on Android emulator
npm run ios           # Start on iOS simulator
npm run web           # Start web version

# Quality Assurance
npm run typecheck     # TypeScript compilation check
npm run lint          # Run ESLint
npm run format        # Format code with Prettier
npm run test          # Run Jest tests
npm run verify        # Run all checks (typecheck + lint + test)

# Maintenance
npm run clean         # Clean cache and node_modules
npm run reset         # Reset Expo cache and restart
```

## Environment Configuration

Copy `.env.example` to `.env` and configure:

```env
API_BASE_URL=http://10.0.2.2:3000
APP_ENV=dev
```

The environment is validated at runtime using Zod schemas in `src/lib/env.ts`.

## Architecture Principles

### 1. Feature-Based Organization
- Group code by feature, not by file type
- Each feature has its own directory with components, hooks, and tests
- Clear boundaries between features

### 2. Type Safety First
- All external data validated with Zod schemas
- Strict TypeScript configuration
- Runtime environment validation
- Shared types from `@better-you/shared` package

### 3. Performance Optimized
- MMKV for lightning-fast storage
- React Query for intelligent caching and synchronization
- Minimal re-renders through proper state management
- Optimized bundle size

### 4. Developer Experience
- File-based routing for intuitive navigation
- Hot reloading for instant feedback
- Comprehensive linting and formatting
- Pre-commit hooks prevent bad code

## State Management

### Server State (React Query)
```typescript
// Feature-specific hooks
export function useHabits() {
  return useQuery({
    queryKey: ["habits"],
    queryFn: fetchHabits,
  });
}

// Mutations with optimistic updates
export function useUpdateHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateHabit,
    onSuccess: () => {
      queryClient.invalidateQueries(["habits"]);
    },
  });
}
```

### Local State (React hooks)
```typescript
// Keep local state minimal
const [selectedId, setSelectedId] = useState<string | null>(null);

// Use MMKV for persistence
import { storage } from "@/src/lib/storage";
const [settings, setSettings] = useState(
  () => storage.getString("user.settings") || defaultSettings,
);
```

## Adding a New Feature

1. **Create feature directory**:
   ```
   src/features/[feature-name]/
   ├── index.ts                    # Export barrel
   ├── use[Feature].ts            # React Query hooks
   ├── [Feature]Screen.tsx        # Main component
   ├── components/                # Feature-specific components
   └── __tests__/                 # Feature tests
   ```

2. **Add route** in `app/` directory:
   ```typescript
   // app/[feature-name].tsx
   import { [Feature]Screen } from "@/src/features/[feature-name]";
   export default [Feature]Screen;
   ```

3. **Create data hook**:
   ```typescript
   // src/features/[feature]/use[Feature].ts
   import { useQuery } from "@tanstack/react-query";
   import { Habit } from "@better-you/shared";

   export function use[Feature]() {
     return useQuery({
       queryKey: ["feature"],
       queryFn: async (): Promise<Habit[]> => {
         // API call
       }
     });
   }
   ```

## Testing

### Test Structure
```
src/features/[feature]/__tests__/
├── [feature].test.tsx      # Component tests
├── [feature].hook.test.ts  # Hook tests
└── [feature].utils.test.ts # Utility tests
```

### Example Test
```typescript
import { render } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Wrap components with providers for testing
const TestWrapper = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
```

## Best Practices

### ✅ Do
- Use shared types from `@better-you/shared`
- Validate all external data with Zod schemas
- Group by feature, not by file type
- Keep components small and focused
- Use React Query for all server state
- Memoize expensive calculations
- Use proper TypeScript types

### ❌ Don't
- Put business logic in UI components
- Create deeply nested folder structures
- Use `any` types
- Skip validation for external data
- Fetch data directly in components
- Create objects in render functions

## Troubleshooting

### Common Issues

1. **Metro bundler issues**:
   ```bash
   npm run reset  # Clear Expo cache
   ```

2. **TypeScript errors after updates**:
   ```bash
   npm run typecheck  # Check for type issues
   ```

3. **iOS build issues**:
   ```bash
   cd ios && pod install  # Update pods
   ```

4. **Git hooks not working**:
   ```bash
   cd .. && npx husky install  # Reinstall hooks from root
   ```

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Query Docs](https://tanstack.com/query/latest)
- [React Native Performance](https://reactnative.dev/docs/performance)
- [Better You Architecture](../docs/ARCHITECTURE.md)

---

_This README is specific to the mobile app. See the main [README](../README.md) for the full project overview._