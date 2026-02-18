# Project Rules & Architecture

## Overview
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Shadcn UI
- **Authentication**: Custom Cookie-based Auth (JWT)

## Directory Structure
- `app/`: Application routes, layouts, and API handlers.
  - `app/api/`: Backend-for-Frontend (BFF) API routes.
  - `app/app/`: Protected application routes (dashboard, etc.).
  - `app/auth/`: Public authentication pages.
  - `app/sitemap.ts`: Dynamic sitemap generation.
  - `app/robots.ts`: Robots.txt generation.
- `components/`: UI components, grouped by feature (e.g., `auth`, `landing`).
  - `components/ui/`: Base Shadcn UI components (Button, Input, etc.).
  - `components/seo/`: SEO-related components (e.g., `json-ld.tsx`).
- `lib/`: Core utilities and helpers.
  - `api-client.ts`: API client wrapper for fetching data.
  - `session.ts`: Session management logic.
  - `token.ts`: JWT token utilities.
  - `utils.ts`: Tailwind utility helper (cn).
- `services/`: API service definitions (e.g., `auth-api.ts`).
- `locales/`: Internationalization JSON files (`en.json`, `fa.json`).
- `public/`: Static assets (fonts, images).

## Architecture Patterns

### 1. Data Fetching
- **Server Components**: Prefer fetching data in Server Components (e.g., `page.tsx`) using `cookies()` and passing data to Client Components.
- **Client Components**: Use `lib/api-client.ts` for client-side data fetching and mutations.
- **API Routes**: Use Next.js Route Handlers (`app/api/`) as a proxy/BFF to handle secure HTTP-only cookies and interface with the backend API.

### 2. State Management
- **Global State**: Avoid global state libraries (Redux/Zustand). Use URL search params and Cookies for persistent state.
- **Local State**: Use React's `useState` and `useReducer` for component-level state.
- **Authentication**: Managed via `waggy_session`, `waggy_access_token`, and `waggy_refresh_token` cookies.

### 3. Styling
- **Methodology**: Tailwind CSS with Shadcn UI components.
- **Global Styles**: Defined in `app/globals.css` (Tailwind base + theme variables).
- **Theming**: Use CSS variables mapped to Tailwind colors (e.g., `--primary`, `--foreground`).
- **Components**: Use Shadcn components from `components/ui/` and customize via `className` or variants.

### 4. Internationalization (i18n)
- **Current Strategy**: Client-side translation for the landing page.
- **Implementation**: JSON files in `locales/` loaded manually in components.
- **Note**: Ensure `dir="rtl"` or `dir="ltr"` is set correctly on the document element based on the selected language.

### 5. SEO & Performance
- **Metadata**: Use the Next.js Metadata API in `layout.tsx` and individual `page.tsx` files.
  - Define `title` templates, `description`, `openGraph`, and `twitter` cards globally.
  - Override specific metadata in leaf pages (e.g., `/services`, `/auth`).
- **Structured Data**: Use the `JsonLd` component (`components/seo/json-ld.tsx`) to inject JSON-LD schema markup.
- **Image Optimization**:
  - Always use `next/image` for images to leverage automatic format conversion (WebP/AVIF) and resizing.
  - Configure remote domains in `next.config.mjs` under `images.remotePatterns`.
  - Use `priority` for LCP (Largest Contentful Paint) images (e.g., hero section).
  - Use `sizes` prop to ensure responsive image loading.
- **Technical SEO**:
  - `app/sitemap.ts`: Keep updated with new public routes.
  - `app/robots.ts`: Manage crawler access rules.

## Coding Conventions

### Naming
- **Files & Directories**: `kebab-case` (e.g., `landing-page.tsx`, `auth-api.ts`).
- **Components**: `PascalCase` (e.g., `LandingPage`, `AuthForm`).
- **Functions & Variables**: `camelCase`.

### Imports
- **Path Aliases**: Not configured. Use relative imports (e.g., `../../components/auth/auth-form`).

### TypeScript
- **Strict Mode**: Enabled. Ensure all types are strictly defined.
- **Interfaces**: Define interfaces for props and API responses.

## Development Workflow
1.  **New Features**: Create a new directory in `components/` for the feature's UI components.
2.  **API Integration**: Define API calls in `services/` or use `lib/api-client.ts` directly.
3.  **Routes**: Add new pages in `app/` following the App Router conventions.
4.  **Testing**: Verify changes manually and ensure no regressions in existing flows.
