# Waggy Web Starter (Next.js 14)

Production-grade starter scaffold for a Rover-like pet services marketplace with:
- EN/FA localization
- RTL-ready layouts
- Owner, sitter, and admin panels
- Auth UI stubs (phone OTP + Google)
- Service-layer API placeholders for future backend integration

## Tech Stack
- Next.js 14 App Router
- TypeScript (strict)
- TailwindCSS
- shadcn-style UI primitives (`components/ui`)
- Zustand (auth/role/sitter/language)
- TanStack Query (mock fetching)
- Zod + React Hook Form
- Framer Motion
- i18next + react-i18next

## Run
1. `npm install`
2. `npm run dev`
3. Open `http://localhost:3000`

## Production Deployment (Docker)
1. Build and run in detached mode:
   - `docker compose up -d --build`
2. Check logs:
   - `docker compose logs -f`
3. Stop:
   - `docker compose down`

App is served on `http://localhost:3000`.

## Project Structure
```text
app/
  page.tsx
  auth/page.tsx
  access-denied/page.tsx
  app/
    layout.tsx
    dashboard/page.tsx
    search-sitters/page.tsx
    bookings/page.tsx
    messages/page.tsx
    pets/page.tsx
    payments/page.tsx
    profile/page.tsx
    become-sitter/page.tsx
    sitter-dashboard/page.tsx
    availability/page.tsx
    services-pricing/page.tsx
    sitter-requests/page.tsx
    earnings/page.tsx
    reviews/page.tsx
  admin/
    layout.tsx
    overview/page.tsx
    users/page.tsx
    sitters/page.tsx
    bookings/page.tsx
    payments/page.tsx
    disputes/page.tsx
    content/page.tsx
    settings/page.tsx
components/
  admin/
  layout/
  providers/
  sections/
  ui/
features/
  auth/
services/
  api-client.ts
  auth-service.ts
  marketplace-service.ts
  admin-service.ts
stores/
  app-store.ts
mocks/
  sitters.ts
  bookings.ts
  chats.ts
  admin.ts
lib/
  i18n.ts
  constants.ts
  utils.ts
types/
  index.ts
locales/
  en.json
  fa.json
```

## API Integration Points
Replace mock/stub logic in:
- `services/auth-service.ts`
- `services/marketplace-service.ts`
- `services/admin-service.ts`
- Optional shared request utility: `services/api-client.ts`

Current behavior simulates network latency and returns data from `mocks/*`.

## Language + RTL
- Language state is stored in Zustand (`stores/app-store.ts`) and persisted to `localStorage`.
- App provider updates `document.documentElement.lang` and `dir` dynamically in `components/providers/app-providers.tsx`.
- EN => `ltr`, FA => `rtl`
- Switch language from header/sidebar using `LanguageSwitcher`.

## Roles and Route Access
- Roles: `guest`, `user`, `admin`
- Store fields: `user`, `role`, `sitterStatus`, `language`
- Guards are handled client-side via `components/layout/protected-route.tsx`:
  - `/app/*` requires authenticated user
  - `/admin/*` requires `admin` role
  - Unauthorized users are redirected to `/access-denied`

## Sitter Flow
- Onboarding route: `/app/become-sitter`
- Statuses:
  - `draft`
  - `pending_review`
  - `approved`
- When approved, sitter navigation items appear automatically in the app sidebar.

## Theme and Visual Direction
- Global design tokens/colors are defined in `app/globals.css` (`:root` CSS variables).
- Tailwind semantic tokens are mapped in `tailwind.config.ts`.
- Update brand palette, border radius, fonts, and gradients in those two files.
- Brand colors implemented:
  - Primary: `#0EA5A4` (+ dark/light variants)
  - Accent: `#FF6B6B`
  - Neutral scale aligned to soft premium grays
  - Semantic colors: success/warning/error/info
- Typography:
  - English: Inter
  - Persian: IRANSans
  - Place font files in `public/fonts/`:
    - `IRANSans-web.woff2`
    - `IRANSans-Medium-web.woff2`
    - `IRANSans-Light-web.woff2`
    - `IRANSans-UltraLight-web.woff2`
    - `IRANSans-Bold-web.woff2`
  - Font sizing scale available in Tailwind: `text-h1`, `text-h2`, `text-h3`, `text-h4`, `text-body-lg`, `text-body`, `text-small`, `text-caption`
- Motion/elevation:
  - Durations/easing tokens in `app/globals.css`
  - Card/button/input hover/focus states standardized in `components/ui/*`

## Notes
- This starter intentionally excludes real backend/auth provider wiring.
- It is optimized for plugging in APIs with minimal refactor.
