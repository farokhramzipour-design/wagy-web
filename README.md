# Waggy Web Starter (Next.js 14 + TypeScript)

Production-grade Rover-like marketplace scaffold with bilingual UX (English + Persian), RTL support, role-based panels, and a clean mock-first architecture.

## Stack
- Next.js 14 App Router
- TypeScript (strict)
- TailwindCSS
- shadcn-style UI primitives (`components/ui`)
- Zustand (auth, role, sitter status, language)
- TanStack Query (mock async data)
- Zod + React Hook Form (auth forms)
- Framer Motion (subtle interactions)
- i18next + react-i18next (EN/FA localization)

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run start
```

## Project Structure
```text
app/
  page.tsx                  # public landing
  auth/page.tsx             # auth UI (phone OTP + google stub)
  access-denied/page.tsx
  app/
    layout.tsx              # protected user shell
    dashboard/
    search-sitters/
    bookings/
    messages/
    pets/
    payments/
    profile/
    become-sitter/
    sitter-dashboard/
    availability/
    services-pricing/
    sitter-requests/
    earnings/
    reviews/
  admin/
    layout.tsx              # protected admin shell
    overview/
    users/
    sitters/
    bookings/
    payments/
    disputes/
    content/
    settings/
  api/auth/
    session/route.ts        # set auth cookies (stub)
    login/route.ts          # form login helper (stub)
    logout/route.ts         # clear auth cookies

components/
  ui/                       # shadcn-style primitives
  layout/                   # public/protected/admin shells, route guards
  providers/                # Query + i18n providers
  sections/                 # landing sections
  auth/                     # auth form

services/
  auth-service.ts           # OTP/google stub service
  query-service.ts          # mock query endpoints

stores/
  app-store.ts              # user, role, sitterStatus, language

mocks/
  sitters.ts
  bookings.ts
  chats.ts
  admin.ts

lib/
  i18n.ts
  use-app-translation.ts
  queries.ts
  session.ts
  utils.ts
  constants.ts

types/
  auth.ts
  domain.ts

locales/
  en.json
  fa.json
```

## Language + RTL
- Language switcher in header (`EN | FA`)
- State stored in Zustand persisted storage (`waggy-app-store`)
- On language change:
  - `document.documentElement.lang` updates
  - `document.documentElement.dir` toggles between `ltr` and `rtl`
- All UI text is loaded from:
  - `locales/en.json`
  - `locales/fa.json`

## Roles and Access
Roles:
- `guest`
- `user`
- `admin`

Sitter statuses:
- `draft`
- `pending_review`
- `approved`

Middleware (`middleware.ts`) rules:
- `/app/*` requires session cookie
- `/admin/*` requires admin role
- unauthorized admin access -> `/access-denied`
- authenticated users visiting `/auth` are redirected to their panel

## Auth Flow (Stub)
Implemented in UI only (no real backend connection):
- Phone flow:
  - Step 1: request OTP (mock)
  - Step 2: verify OTP with 6-digit code (mock)
  - resend timer UI
- Google flow:
  - "Continue with Google" button (mock)
- Session is stored in HTTP-only cookies via `POST /api/auth/session`
- Logout clears cookies via `POST /api/auth/logout`

## TanStack Query Mock Data
Query sources are in `services/query-service.ts` and return data from `mocks/*` with simulated latency.
- sitters
- bookings
- chats
- admin users
- admin KPIs

## Where to Connect Real APIs Later
Replace stub implementations only (leave UI untouched):
1. `services/auth-service.ts`
   - `requestOtpStub`
   - `verifyOtpStub`
   - `googleLoginStub`
2. `services/query-service.ts`
   - swap mock arrays for HTTP calls
3. (optional) add API client in `lib/` and centralize auth headers + errors

Base URL target for future backend:
- `https://api.waggy.ir`

## Theme / Visual Direction
- Global design tokens and color system in `app/globals.css`
- Tailwind theme extension in `tailwind.config.ts`
- Reusable UI primitives in `components/ui/*`

## Notes
- This starter intentionally avoids real backend coupling.
- It is built to scale: feature routes, mock services, role-based shells, and i18n-driven copy are already in place.
