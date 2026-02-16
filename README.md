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
- Logout endpoint: `POST /api/auth/logout`
- Session cookie: `waggy_session` (HTTP-only)
- Middleware protects `/app/*` and redirects guests to `/auth?next=...`
