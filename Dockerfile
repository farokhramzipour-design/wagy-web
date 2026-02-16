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
 && echo "=== ROUTE FILES (app/*page*) ===" \
 && find app -maxdepth 3 -type f \( -name "page.tsx" -o -name "page.ts" -o -name "page.jsx" -o -name "page.js" -o -name "layout.tsx" -o -name "layout.ts" -o -name "layout.jsx" -o -name "layout.js" \) | sort \
 && [ ! -f app/page.js ] \
 && [ ! -f app/page.jsx ] \
 && [ ! -f app/layout.js ] \
 && [ ! -f app/layout.jsx ] \
 && echo "=== BUILD INPUT: app/page.tsx ===" \
 && sed -n '1,80p' app/page.tsx \
 && grep -q "LandingPage" app/page.tsx \
 && echo "=== BUILD INPUT: app/landing/page.tsx ===" \
 && sed -n '1,80p' app/landing/page.tsx \
 && grep -q "LandingPage" app/landing/page.tsx \
 && echo "=== BUILD INPUT: components/landing/landing-page.tsx ===" \
 && sed -n '1,80p' components/landing/landing-page.tsx \
 && grep -q "landing-shell" components/landing/landing-page.tsx \
 && ! grep -q "Welcome back, Friend" components/landing/landing-page.tsx \
 && npm run build \
 && echo "=== BUILD OUTPUT: .next/server/app/page.js ===" \
 && grep -n "landing-page\\|app-shell\\|Welcome back, Friend" .next/server/app/page.js \
 && ! grep -q "Welcome back, Friend" .next/server/app/page.js \
 && echo "=== BUILD OUTPUT: .next/server/app/landing/page.js ===" \
 && grep -n "landing-page\\|Welcome back, Friend" .next/server/app/landing/page.js \
 && grep -q "landing-page" .next/server/app/landing/page.js \
 && echo "=== BUILD OUTPUT: component chunk ===" \
 && grep -RIn "landing-shell\\|Welcome back, Friend" .next/server | head -n 20 \
 && grep -RInq "landing-shell" .next/server \
 && ! grep -q "Welcome back, Friend" .next/server/app/landing/page.js

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
