# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install          # Install dependencies
pnpm run dev          # Start dev server (Turbopack) at http://localhost:3000
pnpm run build        # Production build
pnpm run lint         # ESLint check
pnpm run lint:fix     # Auto-fix ESLint issues
pnpm run check        # Parallel lint + TypeScript type check (tsc --noEmit)
```

Use `pnpm` — not npm or yarn.

## Architecture

**Stack:** Next.js 15 (App Router) + TypeScript + Drizzle ORM + Neon PostgreSQL + NextAuth.js v4 (Google OAuth) + Material-UI v7

**Volunteer management platform** for a Knoxville nonprofit. Three roles: `admin`, `manager`, `user`.

### Data flow

- **Pages** live in `src/app/` using App Router file conventions
- **Server Actions** in `src/actions/` mutate data (attend-event, leave-event, add/update-user-info, update-user-role)
- **API routes** in `src/app/api/` handle events, locations, and eventAttendees
- **DB access** via Drizzle ORM — schema in `src/db/schema/`, connection in `src/db/index.ts`
- **Session** is JWT-based; `src/lib/auth.ts` exports `auth()` for server-side session reads

### Route protection

`src/middleware.ts` uses NextAuth `withAuth()`:
- `/dashboard/*` — requires login + `admin` or `manager` role
- `/dashboard/events-library` — requires `admin` role specifically
- Logged-in users with `infoFilled = false` are redirected to `/info` to complete their profile before accessing anything else

### Database schema (Drizzle + Neon)

Key tables: `users`, `userInfo` (1:1 with cascade delete), `events`, `locations`, `eventAttendees` (composite PK: eventId + userId), plus NextAuth tables (`accounts`, `sessions`).

Soft deletes via `deleted: boolean` on `events` and `locations`. Migration files are in `drizzle/`.

### Auth

Google OAuth only. `src/app/api/auth/[...nextauth]/auth-options.ts` defines the NextAuth config. The JWT callback enriches the token with the full DB user object (role, infoFilled, etc.) so the session has this data client-side.

### Key conventions

- Path alias `@/*` maps to `src/*`
- File naming: kebab-case for files, PascalCase for React components (enforced by ESLint)
- `console.error` is disallowed (ESLint rule)
- Forms use React Hook Form + Zod for validation
- Notifications use Notistack (Snackbar provider in `src/providers/`)
- Maps use Leaflet/React-Leaflet; location coordinates stored with 9,6 precision

## Environment variables

Required in `.env`:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `AUTH_DRIZZLE_URL` | Same as DATABASE_URL (NextAuth adapter) |
| `NEXTAUTH_URL` | `http://localhost:3000` for local dev |
| `NEXTAUTH_SECRET` | NextAuth JWT signing secret |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth app credentials |
| `GEOCODING_API_KEY` | Address geocoding |
| `EMAIL_API_KEY` | Brevo (SendinBlue) for email sending |
| `CRON_SECRET` | Authenticates scheduled job API calls |

## PR conventions

Titles follow Conventional Commits: `feat:`, `fix:`, `style:`, `refactor:`, etc. Branch names should include your name.
