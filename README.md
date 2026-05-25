# Evolution

Evolution is a Bun + TypeScript monorepo for Evolua, an adaptive behavioral health and wellness SaaS.

## Architecture Overview

The repository follows Clean Architecture with strict package boundaries.

- `apps/web`: Next.js App Router frontend. It contains routes, UI composition, components, hooks, client-side form state, Firebase Auth session handling, and API client calls.
- `apps/api`: Elysia backend API. It owns authentication verification, persistence, onboarding progress, scoring orchestration, adaptive profile generation, plan generation, dashboard aggregation, check-ins, and cycle reports.
- `packages/domain`: Pure business rules, constants, formulas, scoring, protocols, plan helpers, and TypeScript types. It must remain framework-agnostic.
- `packages/firebase`: Firebase client/admin helpers shared by apps. Firebase Auth remains the identity provider.
- `packages/ui`: Shared shadcn-style primitives, motion helpers, and reusable UI building blocks.
- `packages/config`: Shared config and environment helpers.

## Clean Architecture Rules

- Frontend components must not contain scoring formulas, SVC/GAP/SPI calculations, plan generation, direct database writes, or adaptive engine logic.
- Frontend code talks to `apps/api` through `apps/web/src/lib/api-client`.
- Controllers in `apps/api` stay thin: parse input, call use cases, return API responses.
- Persistence access is isolated in infrastructure repositories. The default production path is Firebase SQL Connect / Cloud SQL for PostgreSQL.
- Use cases orchestrate application behavior and call `packages/domain` for pure calculations.
- `packages/domain` must not import React, Next.js, Elysia, Firebase, browser APIs, or Node APIs unless explicitly justified.

## Apps/Web Setup

```bash
bun install
cp apps/web/.env.example apps/web/.env.local
bun dev:web
```

Required frontend variables:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_API_URL=http://localhost:4000
```

The frontend uses Firebase client Auth only. It must not write Evolua business data directly to Firestore.

## Apps/API Setup

```bash
cp apps/api/.env.example apps/api/.env
bun dev:api
```

Required API variables:

```bash
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
FIREBASE_DATABASE_URL=
CORS_ORIGIN=http://localhost:3000,https://evolution.institutoez.com.br
PERSISTENCE_DRIVER=sql
SQL_CONNECT_DATABASE_URL=
SQL_CONNECT_SERVICE_ID=evolution
SQL_CONNECT_LOCATION=us-central1
```

`FIREBASE_PRIVATE_KEY` may need escaped newlines (`\n`) depending on the shell or deployment provider.
`CORS_ORIGIN` accepts a comma-separated list of frontend origins.

## Firebase Setup

1. Create a Firebase project.
2. Enable Email/Password authentication.
3. Create a Firebase Admin service account.
4. Copy client SDK values into `apps/web/.env.local`.
5. Copy Admin SDK values into `apps/api/.env`.
6. Create a Firebase SQL Connect service backed by Cloud SQL for PostgreSQL.
7. Set `SQL_CONNECT_DATABASE_URL` with the PostgreSQL connection string exposed for the backend environment.
8. Run database migrations.

## Firebase SQL Connect

The API uses PostgreSQL repositories when `PERSISTENCE_DRIVER=sql`.

Migration files live in:

```bash
apps/api/migrations
```

Run migrations with:

```bash
bun db:migrate
```

Firebase SQL Connect/Data Connect configuration lives in:

```bash
dataconnect/
```

The app keeps the same repository interfaces for Firestore and SQL. This lets use cases remain unchanged while persistence is selected by env.

Relational tables:

```text
users
cycles
body_measurements
triage_sessions
investigations
operational_assessments
adaptive_profiles
action_plans
checkins
cycle_reports
```

## Scripts

```bash
bun dev          # run app dev scripts
bun dev:web      # Next.js frontend
bun dev:api      # Elysia API
bun db:migrate   # run SQL migrations
bun check        # Biome format/lint/import checks
bun lint         # Biome lint
bun format       # Biome format write
bun typecheck    # TypeScript project references
bun test         # domain + API tests
```

Package-level tests:

```bash
bun --filter @evolution/domain test
bun --filter @evolution/api test
```

## Biome

BiomeJS is the only linting and formatting tool.

- Do not add ESLint.
- Do not add Prettier.
- Keep import organization under Biome.
- Run `bun check` before handing off changes.

## Project Conventions

- No source file may exceed 500 lines.
- Prefer files under 250 lines.
- Split large screens into page, container, sections, cards, hooks, schema, and API adapter files.
- Route `page.tsx` files should mostly compose components.
- Keep controllers thin and use cases focused on one responsibility.
- Keep DTOs typed and validated at the API boundary.
- API responses use:

```json
{ "success": true, "data": {}, "meta": {} }
```

Errors use:

```json
{ "success": false, "error": { "code": "CODE", "message": "Mensagem amigável" } }
```

## Stitch MCP

Stitch MCP is used as the visual reference for Evolua screens, not as pasted production code.

The current visual direction is based on the Evolution Stitch project:

- warm off-white background
- Mystic Modern purple palette
- soft white cards
- spacious dashboard hierarchy
- mobile-friendly onboarding and check-in flows
- timeline treatment for the 45-day plan

Generated Stitch output should be translated into clean React components using existing shadcn-style primitives from `packages/ui`.
