# Waggy Web (Clean Restart)

Stable clean Next.js 14 baseline with:
- Public home (`/`)
- Auth placeholder (`/auth`)
- App area (`/app`)
- Dashboard placeholder (`/app/dashboard`)
- Server-side auth middleware for `/app/*`

## Run locally
```bash
npm install
npm run dev
```

## Docker
```bash
docker compose up -d --build --force-recreate
```

## Auth Flow (Cookie Session)
- Login endpoint: `POST /api/auth/login`
- Session endpoint after real OTP verify: `POST /api/auth/session`
- Logout endpoint: `POST /api/auth/logout`
- Backend logout call on sign-out: `POST /api/v1/auth/logout` with `refresh_token`
- Session cookie: `waggy_session` (HTTP-only)
- Middleware protects `/app/*` and redirects guests to `/auth?next=...`
- Session payload includes `name` and `role` (`user` or `admin`)
- Dashboard shows role-aware placeholder cards

## Backend API (waggy)
- Base URL: `https://api.waggy.ir`
- Override with: `NEXT_PUBLIC_API_BASE_URL`
- Endpoint catalog: `lib/api-endpoints.ts`
- API client: `lib/api-client.ts`
- Auth API wrappers: `services/auth-api.ts`

### Implemented now
- OTP request: `POST /api/v1/auth/otp/request`
- OTP verify: `POST /api/v1/auth/otp/verify`
- Refresh access token: `POST /api/v1/auth/refresh`
- Me endpoint after login: `GET /api/v1/auth/me`
- Google login entry: `GET /api/v1/auth/google/login`

### Token refresh behavior
- Middleware reads `waggy_access_token` and `waggy_refresh_token`
- If access token is missing/near expiry and refresh token exists, middleware calls refresh API
- On success, middleware updates `waggy_access_token` cookie and continues request
- If no usable session/tokens for `/app/*`, user is redirected to `/auth?next=...`
