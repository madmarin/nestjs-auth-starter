# Stage 1: build
FROM node:22.14.0-alpine3.21 AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Stage 2: production
FROM node:22.14.0-alpine3.21 AS production

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 4002

CMD ["node", "dist/main"]
