# Contributing to NestJS Auth Starter

Thank you for taking the time to contribute! This guide explains how to get set up, what conventions to follow, and how to submit a good pull request.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Convention](#commit-convention)
- [Branch Naming](#branch-naming)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Code Style](#code-style)
- [Testing](#testing)
- [Reporting Issues](#reporting-issues)

---

## Getting Started

### Prerequisites

- [Node.js 22+](https://nodejs.org)
- [pnpm](https://pnpm.io)
- [Docker + Docker Compose](https://docs.docker.com/compose/)

### Setup

```bash
# 1. Fork the repo and clone your fork
git clone https://github.com/<your-username>/nestjs-auth-starter.git
cd nestjs-auth-starter

# 2. Install dependencies
pnpm install

# 3. Copy the environment template
cp .env.template .env.development

# 4. Start infrastructure (PostgreSQL + Redis)
docker compose up -d

# 5. Start the API in watch mode
pnpm start:dev
```

---

## Development Workflow

1. **Create a branch** from `main` following the [naming convention](#branch-naming).
2. **Make your changes** — keep commits small and focused.
3. **Run lint and tests** before pushing:
   ```bash
   pnpm lint
   pnpm test
   ```
4. **Push** and open a pull request against `main`.

The CI pipeline will run lint, build, and unit tests automatically on every pull request.

---

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(optional scope): <short description>
```

| Type       | When to use                                      |
| ---------- | ------------------------------------------------ |
| `feat`     | New feature                                      |
| `fix`      | Bug fix                                          |
| `refactor` | Code change that is neither a fix nor a feature  |
| `test`     | Adding or updating tests                         |
| `docs`     | Documentation only changes                       |
| `chore`    | Build process, dependencies, tooling             |
| `ci`       | CI/CD configuration changes                      |
| `perf`     | Performance improvement                          |

**Examples:**

```
feat(auth): add Google OAuth provider
fix(session): prevent duplicate session keys on concurrent refresh
docs: update environment variable reference in README
test(user): add edge case for duplicate email on create
```

---

## Branch Naming

```
<type>/<short-description>
```

```
feat/google-oauth
fix/session-race-condition
docs/env-variables
test/user-create-edge-cases
```

---

## Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR.
- Fill out the pull request template (title, summary, test plan).
- All CI checks must pass before a PR can be merged.
- At least one review approval is required.
- Squash commits when merging if the branch history is noisy.

---

## Code Style

Formatting and linting are enforced automatically:

```bash
pnpm lint        # ESLint + Prettier (auto-fix)
pnpm format      # Prettier only
```

Key conventions:
- Services follow the **single responsibility** pattern — one `execute()` method per service.
- New modules go alongside `auth/` and `user/` at the `src/` level.
- Extend `BaseEntity` for all TypeORM entities.
- Use `src/` path aliases instead of relative imports (e.g. `src/user/entities`).

---

## Testing

Unit tests live next to the source file they test (`*.service.spec.ts`).

```bash
pnpm test           # Run all unit tests
pnpm test:cov       # Coverage report
pnpm test:e2e       # E2E tests (requires Docker services running)
```

When adding a new service, include a corresponding `*.spec.ts` that covers:
- Happy path
- Error / edge cases (not found, conflict, unauthorized, etc.)

Mock all external dependencies (`CACHE_MANAGER`, repositories, other services). Use `jest.mock()` for modules that run side effects at import time (e.g. `src/config`).

---

## Reporting Issues

Please [open an issue](https://github.com/madmarin/nestjs-auth-starter/issues) and include:

- A clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Node.js / pnpm / Docker versions (`node -v`, `pnpm -v`)
- Relevant logs or screenshots

---

Thank you for helping make this template better for everyone!
