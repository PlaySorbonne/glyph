# 1) Base + deps
FROM node:20.10-alpine AS deps

ARG NODE_ENV="production"
ARG MAIN_URL="http://localhost:3000"
ARG PORT=3000

ENV NODE_ENV=${NODE_ENV}
ENV MAIN_URL=${MAIN_URL}
ENV PORT=${PORT}

RUN apk add --no-cache libc6-compat curl tzdata sqlite \
 && ln -snf /usr/share/zoneinfo/Europe/Paris /etc/localtime \
 && echo "Europe/Paris" > /etc/timezone \
 && corepack enable \
 && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 2) Builder
FROM deps AS builder
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm prisma generate \
 && pnpm build \
 && pnpm store prune

# 3) Runner
FROM gcr.io/distroless/nodejs:22 AS runner
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

USER nonroot:nonroot
HEALTHCHECK --interval=30s --timeout=5s \
  CMD curl --fail http://localhost:${PORT:-3000}/_health || exit 1

EXPOSE ${PORT:-3000}
ENTRYPOINT ["pnpm", "run"]
CMD ["start:migrate:prod"]
