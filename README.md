# BetterYou Mobile

A modern React Native mobile application built with Expo, TypeScript, and a carefully curated set of libraries for scalable development.

## 🏗️ Architecture Overview

### Tech Stack

- **Framework**: Expo SDK with React Native
- **Language**: TypeScript for type safety
- **Navigation**: Expo Router (file-based routing)
- **State Management**: TanStack React Query for server state
- **Storage**: React Native MMKV for high-performance local storage
- **Validation**: Zod for runtime type validation
- **Notifications**: Expo Notifications
- **Styling**: React Native with design tokens

### Project Structure

```
betteryou-mobile/
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
├── .cursor/              # IDE configuration
├── .github/workflows/    # CI/CD workflows
└── assets/              # Static assets
```

## 🚀 Quick Start

### Prerequisites

1. **Node.js 20.11.1** (managed via nvm):

   ```powershell
   nvm install 20.11.1
   nvm use 20.11.1
   ```

2. **npm** (comes with Node.js):

   ```powershell
   npm --version  # Should be 10.x or higher
   ```

3. **Mobile Development** (choose one):
   - **Expo Go app** on your phone (easiest)
   - **Android Studio** with Android SDK Platform 34 + ANDROID_HOME set
   - **Xcode** for iOS development (macOS only)

### Installation

1. **Clone and setup**:

   ```powershell
   cd betteryou-mobile
   npm install
   cp .env.example .env
   ```

2. **Start development server**:

   ```powershell
   npm run dev
   ```

3. **Test on device**:
   - Scan QR code with Expo Go app
   - Or run `npm run android` / `npm run ios` for emulators

## 📚 Key Libraries & Rationale

### Core Dependencies

| Library                   | Purpose                 | Why Chosen                                                        |
| ------------------------- | ----------------------- | ----------------------------------------------------------------- |
| **@tanstack/react-query** | Server state management | Industry standard for data fetching, caching, and synchronization |
| **zod**                   | Runtime validation      | Type-safe environment config and API validation                   |
| **react-native-mmkv**     | Local storage           | Fastest storage solution for React Native                         |
| **expo-notifications**    | Push notifications      | Official Expo solution with great DX                              |
| **expo-router**           | Navigation              | File-based routing, modern and intuitive                          |

### Development Tools

| Tool                       | Purpose         | Configuration                     |
| -------------------------- | --------------- | --------------------------------- |
| **ESLint**                 | Code linting    | React Native rules + custom rules |
| **Prettier**               | Code formatting | Consistent formatting across team |
| **Husky**                  | Git hooks       | Pre-commit formatting and linting |
| **Jest + Testing Library** | Testing         | Component and unit testing        |
| **TypeScript**             | Type safety     | Strict mode enabled               |

## 🛠️ Available Scripts

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

## 🏛️ Architecture Principles

### 1. **Separation of Concerns**

- **`/app`**: Navigation and routing only
- **`/src/features`**: Business logic grouped by feature
- **`/src/components`**: Reusable UI components
- **`/src/lib`**: Utilities and external service integrations

### 2. **Type Safety First**

- All external data validated with Zod schemas
- Strict TypeScript configuration
- Runtime environment validation

### 3. **Performance Optimized**

- MMKV for lightning-fast storage
- React Query for intelligent caching
- Minimal re-renders through proper state management

### 4. **Developer Experience**

- File-based routing for intuitive navigation
- Hot reloading for instant feedback
- Comprehensive linting and formatting
- Pre-commit hooks prevent bad code

## 🔧 Configuration Files

### Environment Configuration

**`.env`** (copy from `.env.example`):

```env
API_BASE_URL=http://10.0.2.2:3000
APP_ENV=dev
```

**`src/lib/env.ts`** - Validates environment variables at runtime:

```typescript
import { z } from "zod";
const schema = z.object({
  API_BASE_URL: z.string().url(),
  ENV: z.enum(["dev", "preview", "prod"]),
});
```

### App Configuration

**`app.config.ts`** - Expo configuration with environment support:

- Dynamic configuration based on environment
- Plugin setup for notifications
- Platform-specific settings

## 🧪 Testing Strategy

### Current Setup

- **Jest** with `jest-expo` preset
- **React Native Testing Library** for component testing
- **@testing-library/jest-native** for custom matchers

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

## 📱 Features Implementation Guide

### Adding a New Feature

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

   export function use[Feature]() {
     return useQuery({
       queryKey: ["feature"],
       queryFn: async () => {
         // API call
       }
     });
   }
   ```

### State Management Patterns

#### Server State (React Query)

```typescript
// Good: Feature-specific hooks
export function useHabits() {
  return useQuery({
    queryKey: ["habits"],
    queryFn: fetchHabits,
  });
}

// Good: Mutations with optimistic updates
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

#### Local State (React hooks)

```typescript
// Good: Keep local state minimal
const [selectedId, setSelectedId] = useState<string | null>(null);

// Good: Use MMKV for persistence
import { storage } from "@/src/lib/storage";
const [settings, setSettings] = useState(
  () => storage.getString("user.settings") || defaultSettings,
);
```

## 🔒 Best Practices

### Code Organization

#### ✅ Do

- Group by feature, not by file type
- Use barrel exports (`index.ts`) for clean imports
- Keep components small and focused
- Prefer composition over inheritance

#### ❌ Don't

- Put business logic in components
- Create deeply nested folder structures
- Use default exports for multiple exports
- Mix UI and data fetching concerns

### Performance

#### ✅ Do

```typescript
// Memoize expensive calculations
const expensiveValue = useMemo(() => heavyCalculation(data), [data]);

// Use React Query for caching
const { data } = useQuery({
  queryKey: ["key"],
  queryFn: fetchData,
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

#### ❌ Don't

```typescript
// Don't fetch data in components
useEffect(() => {
  fetch("/api/data").then(setData);
}, []);

// Don't create objects in render
<Component style={{ marginTop: 10 }} />
```

### Type Safety

#### ✅ Do

```typescript
// Validate API responses
const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
});
type User = z.infer<typeof UserSchema>;

// Use discriminated unions
type LoadingState =
  | { status: "loading" }
  | { status: "success"; data: User[] }
  | { status: "error"; error: string };
```

#### ❌ Don't

```typescript
// Don't use 'any'
const data: any = response.json();

// Don't skip validation
const user = response.data; // No validation
```

## 🚀 Deployment

### Environment Setup

1. **Development**: Uses `.env` with local API
2. **Preview**: EAS Preview builds for testing
3. **Production**: EAS Production builds for stores

### EAS Build Configuration

```json
// eas.json (to be created)
{
  "build": {
    "development": {
      "developmentClient": true
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

## 🔧 Maintenance

### Regular Tasks

#### Weekly

- Update dependencies: `npm update`
- Review ESLint warnings
- Check bundle size with `npx expo bundle-assets`

#### Monthly

- Expo SDK updates: `npx expo upgrade`
- Security audit: `npm audit`
- Clean up unused dependencies

### Troubleshooting

#### Common Issues

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
   npx husky install  # Reinstall hooks
   ```

### Performance Monitoring

- Use Expo dev tools for bundle analysis
- Monitor React Query DevTools in development
- Profile with React DevTools
- Test on older devices regularly

## 📞 Support

### Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Query Docs](https://tanstack.com/query/latest)
- [React Native Performance](https://reactnative.dev/docs/performance)

### Team Conventions

- Follow Conventional Commits for commit messages
- Use feature branches for development
- Require PR reviews for main branch
- Run `npm run verify` before committing

---

_This README reflects the current architecture as of setup. Keep it updated as the project evolves._
