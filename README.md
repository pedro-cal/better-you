# Better You

**Better You** is a **mobile-first, AI-powered personal development platform** focused on helping people achieve clear, meaningful goals through capacity-aware pacing, adaptive coaching, and ambient community support.

This is a **production-grade, portfolio-level system** designed to scale from MVP to thousands of users, demonstrating real-world system design, backend/infrastructure patterns, and AI integration.

---

## Core Product Goals

1. Help users **achieve clear, meaningful goals** while **actively participating** in the progress of others
2. Reduce dropout through **capacity-aware pacing** and **non-punitive adjustment**
3. Provide **AI and human support** that respects user agency
4. Enable **ambient community presence** without feeds or engagement traps

### Supported Languages
- 🇺🇸 **English (en)** - Full support
- 🇧🇷 **Brazilian Portuguese (pt-BR)** - Full support

> **📖 Complete Product Specification**: See [PRODUCT_FOUNDATIONS.md](PRODUCT_FOUNDATIONS.md) for detailed product vision, domain model, events, and API surface.

---

## Repository Structure

Monorepo structure with mobile app, backend (planned), and shared utilities:

```
better-you/
├── mobile/        # React Native mobile app
├── backend/       # Next.js API (planned)
├── shared/        # Shared types and utilities
├── docs/          # Technical documentation
└── package.json   # Workspace configuration
```

> **📋 Current Status**: See [STATUS.md](STATUS.md) for current phase and next steps.  
> **🏗️ Architecture Details**: See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for complete technical architecture.

---

## Quick Start

### Prerequisites
- **Node.js 20.11.1** (via nvm)
- **Mobile Development**: Expo Go app (easiest) or Android Studio/Xcode

### Installation
```bash
git clone <repository-url>
cd better-you
pnpm install
pnpm mobile:dev  # Start mobile app
```

> **📱 Mobile Development**: See [mobile/README.md](mobile/README.md) for detailed mobile setup and troubleshooting.  
> **⚙️ Development Commands**: See [STATUS.md](STATUS.md) for complete command reference.

---

## Documentation

- **[PRODUCT_FOUNDATIONS.md](PRODUCT_FOUNDATIONS.md)** - ⚠️ Authoritative product specification (domain model, events, API surface)
- **[STATUS.md](STATUS.md)** - Current phase, roadmap, next actions, and developer quick start
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Technical architecture, tech stack, and design decisions

---

## Contributing

We use [Conventional Commits](https://www.conventionalcommits.org/) for git history:
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `refactor:` code refactoring
- `test:` adding tests
- `chore:` maintenance tasks

---

## License

MIT License - see [LICENSE](LICENSE) for details.