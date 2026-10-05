# syntax=docker.io/docker/dockerfile:1.7
##
# Admin (Next.js standalone) — Fast Cross-Platform Build

ARG NODE_VERSION=22

# ---- node-target: provides architecture-matched Node binary for runner -----
FROM node:${NODE_VERSION}-alpine AS node-target

# ---- deps: install on NATIVE host platform (Fast AMD64) ---------------------
FROM --platform=$BUILDPLATFORM node:${NODE_VERSION}-alpine AS deps
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# ---- builder: compile standalone server on NATIVE host platform -------------
FROM --platform=$BUILDPLATFORM node:${NODE_VERSION}-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production \
    BUILD_STANDALONE=true \
    SKIP_ENV_VALIDATION=1 \
    NEXT_PUBLIC_ROOT_API_URL=https://agents-app.devxhub.com \
    NEXT_TELEMETRY_DISABLED=1

RUN pnpm build \
    && rm -rf \
       .next/standalone/node_modules/typescript \
       .next/standalone/node_modules/.pnpm/typescript@* \
       .next/standalone/node_modules/@img/sharp-libvips-linux-arm64 \
       .next/standalone/node_modules/@img/sharp-libvips-linux-x64 \
       .next/standalone/node_modules/@img/sharp-linux-arm64 \
       .next/standalone/node_modules/@img/sharp-linux-x64 \
       .next/standalone/node_modules/.pnpm/@img+sharp-libvips-linux-arm64@* \
       .next/standalone/node_modules/.pnpm/@img+sharp-libvips-linux-x64@* \
       .next/standalone/node_modules/.pnpm/@img+sharp-linux-arm64@* \
       .next/standalone/node_modules/.pnpm/@img+sharp-linux-x64@*

# ---- runner: minimal non-root runtime (TARGET PLATFORM) -------------------
FROM alpine:3.21 AS runner
WORKDIR /app
RUN apk add --no-cache libstdc++ libgcc

# Pull architecture-matched Node binary
COPY --from=node-target /usr/local/bin/node /usr/local/bin/node

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3002 \
    NEXT_PUBLIC_ROOT_API_URL=https://agents-app.devxhub.com \
    HOSTNAME=0.0.0.0

ARG UID=1001
ARG GID=1001
RUN addgroup -g "${GID}" nodejs \
    && adduser -S -u "${UID}" -G nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --chown=nextjs:nodejs docker-entrypoint.js ./docker-entrypoint.js

USER nextjs
EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD wget -qO /dev/null "http://127.0.0.1:${PORT}/api/config" || exit 1

CMD ["node", "docker-entrypoint.js"]
