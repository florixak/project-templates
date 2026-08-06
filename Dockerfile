# Development image with Vite HMR
FROM node:22-alpine AS development
RUN apk update && apk upgrade --no-cache
WORKDIR /app
RUN corepack enable
ENV CI=true
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev", "--host", "0.0.0.0"]

# Production build
FROM node:22-alpine AS builder
RUN apk update && apk upgrade --no-cache
WORKDIR /app
RUN corepack enable
ENV CI=true
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Minimal Nitro Node runner
FROM node:22-alpine AS runner
RUN apk update && apk upgrade --no-cache
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.output ./.output
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
