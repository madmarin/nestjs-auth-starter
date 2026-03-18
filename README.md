<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="80" alt="Nest Logo" />
  </a>
</p>

<h1 align="center">NestJS Auth Starter</h1>

<p align="center">
  Production-ready authentication template built with NestJS — JWT access tokens, Redis-backed refresh sessions, PostgreSQL, and Swagger out of the box.
</p>

<p align="center">
  <img src="https://github.com/madmarin/nestjs-auth-starter/actions/workflows/ci.yml/badge.svg" alt="CI" />
  <img src="https://github.com/madmarin/nestjs-auth-starter/actions/workflows/docker.yml/badge.svg" alt="Docker" />
  <img src="https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Redis-7-DC382D?logo=redis" alt="Redis" />
  <img src="https://img.shields.io/badge/pnpm-latest-F69220?logo=pnpm" alt="pnpm" />
  <img src="https://img.shields.io/badge/Docker-ready-2496ED?logo=docker" alt="Docker" />
</p>

---

## Features

- **JWT Authentication** — short-lived access tokens (15 min default)
- **Redis Sessions** — refresh tokens stored in Redis with configurable TTL per client type (web / mobile)
- **PostgreSQL + TypeORM** — entity-based ORM with auto-sync for development
- **Swagger UI** — auto-generated API docs at `/api`
- **Rate Limiting** — global throttler via `@nestjs/throttler`
- **Global Exception Filter** — unified error response shape
- **Response Interceptor** — consistent success response envelope
- **Environment Validation** — Joi schema validation on startup
- **Multi-stage Docker build** — lean production image (~alpine)

## Tech Stack

| Layer            | Technology        |
| ---------------- | ----------------- |
| Framework        | NestJS 11         |
| Language         | TypeScript 5      |
| Database         | PostgreSQL 16     |
| Cache / Sessions | Redis 7           |
| ORM              | TypeORM 0.3       |
| Auth             | JWT + bcryptjs    |
| Docs             | Swagger / OpenAPI |
| Runtime          | Node.js 22 LTS    |
| Package manager  | pnpm              |

## Project Structure

```
src/
├── auth/
│   ├── controllers/       # Login, logout, register, token refresh
│   ├── decorators/        # @Auth(), @GetUser(), @Public()
│   ├── dto/               # Login, register, JWT payload, session DTOs
│   ├── guards/            # JwtAuthGuard
│   ├── interfaces/        # Session metadata
│   └── services/
│       ├── core/          # Login, logout, register
│       ├── custom/        # Session creation, token generation, refresh
│       └── validation/    # Credential validation
├── user/
│   ├── entities/          # User entity
│   └── services/
│       ├── core/          # Create, find-one
│       └── custom/        # Find-by-email
├── common/
│   ├── dto/               # ApiResponse envelope
│   ├── entities/          # BaseEntity
│   ├── filters/           # AllExceptionsFilter
│   └── interceptors/      # ResponseInterceptor
└── config/                # Env, TypeORM, Redis, Swagger, Throttle configs
```

## Getting Started

### Prerequisites

- [Node.js 22+](https://nodejs.org)
- [pnpm](https://pnpm.io)
- [Docker + Docker Compose](https://docs.docker.com/compose/)

### 1. Clone and install

```bash
git clone https://github.com/madmarin/nestjs-auth-starter.git my-project
cd my-project
pnpm install
```

### 2. Configure environment

```bash
cp .env.template .env
```

Edit `.env` with your values — at minimum change `JWT_SECRET`:

```env
NODE_ENV=development
PORT=4000

DB_HOST=nestjs-auth-starter-db-dev
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=auth_starter_dev
DB_SYNCHRONIZE=true

REDIS_HOST=nestjs-auth-starter-redis-dev
REDIS_PORT=6380
REDIS_PASSWORD=redis_dev_password

BCRYPT_SALT_ROUNDS=10

JWT_SECRET=change_this_for_a_long_random_secret
JWT_EXPIRES_IN=15m

THROTTLE_TTL=60000
THROTTLE_LIMIT=100

SESSION_TTL_WEB_MS=86400000      # 1 day
SESSION_TTL_MOBILE_MS=2592000000 # 30 days
```

### 3. Run with Docker Compose

```bash
docker compose -f docker-compose.development.yml --env-file .env up -d
```

This starts:

- **PostgreSQL** on port `5434`
- **Redis** on the configured `REDIS_PORT` (default `6380`)
- **API** on port `4003` (maps to internal `4000`)

### 4. Run locally (without Docker)

Point `DB_HOST` and `REDIS_HOST` to your local instances, then:

```bash
pnpm start:dev
```

## API Endpoints

Once running, visit **[http://localhost:4003/api](http://localhost:4003/api)** for the full Swagger UI.

| Method | Path             | Description                                   |
| ------ | ---------------- | --------------------------------------------- |
| `POST` | `/auth/register` | Create a new account                          |
| `POST` | `/auth/login`    | Login, returns access + refresh tokens        |
| `POST` | `/auth/refresh`  | Exchange refresh token for a new access token |
| `POST` | `/auth/logout`   | Invalidate the current session                |

## Scripts

```bash
pnpm start:dev      # Development with watch mode
pnpm start:prod     # Run compiled output
pnpm build          # Compile TypeScript
pnpm test           # Unit tests
pnpm test:e2e       # End-to-end tests
pnpm test:cov       # Coverage report
pnpm lint           # Lint and auto-fix
```

## Docker

### Development (hot-reload)

Uses `Dockerfile.dev` — installs all dependencies including devDependencies for watch mode.

```bash
docker compose -f docker-compose.development.yml --env-file .env up -d --build
```

### Production

Uses `Dockerfile` — multi-stage build, only compiled JS and production dependencies in the final image.

```bash
docker compose -f docker-compose.production.yml --env-file .env up -d --build
```

### Makefile shortcuts

A `Makefile` is included as a convenience wrapper for the most common Docker commands:

```bash
make dev-up      # Start all services (no rebuild)
make dev-build   # Start all services and rebuild the API image
make dev-down    # Stop and remove containers
make help        # List all available commands
```

## Customization Checklist

When using this as a template, here is what you will typically want to change:

- [ ] Rename the project in `package.json`, `docker-compose.development.yml`, and `docker-compose.production.yml`
- [ ] Set a strong `JWT_SECRET` in your production environment
- [ ] Adjust `JWT_EXPIRES_IN`, `SESSION_TTL_WEB_MS`, `SESSION_TTL_MOBILE_MS` to your needs
- [ ] Extend the `User` entity with your domain fields
- [ ] Add your own modules alongside `auth/` and `user/`
- [ ] Disable `DB_SYNCHRONIZE` and set up proper migrations before going to production

## License

MIT
