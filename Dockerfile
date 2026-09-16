FROM node:22-alpine AS builder
RUN apk update && apk upgrade --no-cache
WORKDIR /app
RUN corepack enable
ENV CI=true
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:22-alpine AS runner
RUN apk update && apk upgrade --no-cache
WORKDIR /app
RUN corepack enable
ENV NODE_ENV=production
ENV CI=true
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=builder /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/src/main.js"]
