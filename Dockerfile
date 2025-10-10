FROM node:22-alpine AS base

RUN corepack enable && corepack prepare pnpm@latest --activate

RUN apk add --no-cache tzdata sqlite
RUN ln -snf /usr/share/zoneinfo/Europe/Paris /etc/localtime && echo "Europe/Paris" > /etc/timezone
ENV TZ="Europe/Paris"

ARG NODE_ENV="production"
ARG NEXT_PUBLIC_MAIN_URL="http://localhost:3000"
ARG PORT=3000

ENV NODE_ENV=${NODE_ENV}
ENV NEXT_PUBLIC_MAIN_URL=${NEXT_PUBLIC_MAIN_URL}
ENV PORT=${PORT}

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat curl

# Install pnpm globally

WORKDIR /app

# Copy pnpm lockfile
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY . .

RUN pnpm prisma generate

ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm prisma generate
RUN pnpm build

FROM base AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system nodejs
RUN adduser --system -G nodejs nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

VOLUME [ "/app/prisma" ]

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE ${PORT}
ENV PORT=${PORT}
ENV HOSTNAME="0.0.0.0"

CMD ["pnpm", "run", "start:migrate:prod"]
