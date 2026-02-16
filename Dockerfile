# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
COPY package.json ./
RUN npm install --no-audit --no-fund && npm cache clean --force

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN rm -rf .next \
 && echo "=== BUILD INPUT: app/page.tsx ===" \
 && sed -n '1,80p' app/page.tsx \
 && grep -q "landing-shell" app/page.tsx \
 && ! grep -q "Welcome back, Friend" app/page.tsx \
 && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
