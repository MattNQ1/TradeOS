# TradeOS — project context for Claude

This file is auto-read at the start of every Claude Code session.
It's the source of truth for what this project is, how it's built, and the
conventions to follow. If you're a fresh Claude instance reading this for
the first time, you have enough context to be useful immediately.

For *currently pending work* and *recent decisions*, see `HANDOFF.md`.

---

## What is TradeOS?

A mobile-first SaaS toolkit for prop firm futures traders. Built solo by Matt
(GitHub: `MattNQ1`). Live at https://usetradeos.vercel.app.

**Target user:** a prop firm trader who wants one tool that replaces a pile of
half-broken trading widgets (calculator, journal, prop firm tracker, economic
calendar, AI coach) on their phone.

**Business model:**
- Free tier — basic calculator, journal, prop firm tracker, economic calendar
- **Pro ($19/mo, 7-day trial)** — adds the Coach tab (pre-trade checklist + AI
  journal insights), unlimited trades, advanced analytics
- **Lifetime ($199 one-time)** — same as Pro, forever

---

## Tech stack

- **Next.js 15** App Router, TypeScript, React 19
- **Tailwind v4** (note: PostCSS v8 + `@tailwindcss/postcss`, no `tailwind.config.js`)
- **Supabase** for Postgres + auth + RLS. Cookies-based auth via `@supabase/ssr`.
- **Stripe** for billing. Live mode in production. Lazy-init Proxy pattern so
  missing keys don't break the build.
- **Google Gemini 2.5 Flash** for AI journal insights. Free tier (1500
  req/day, 15 req/min). **NOT Anthropic** — we deliberately switched off it
  because the user didn't want a paid AI dependency. Same lazy-init Proxy.
- **No chart library.** All charts are hand-rolled SVG. Don't add Recharts.
- Deployed to **Vercel**.

---

## Repo layout

```
src/
  app/
    (app)/          ← authenticated routes (gated by middleware)
      dashboard/    ← Home tab
      calculator/   ← Calc tab
      journal/      ← Journal tab
      coach/        ← Coach tab (PRO ONLY — checklist + AI insights)
      prop-firm/    ← Prop tab
      economic-calendar/  ← Econ tab
      settings/
      layout.tsx    ← top bar + bottom nav (6 tabs)
    (auth)/         ← login, signup, forgot/reset password
    auth/callback/  ← Supabase OAuth callback
    api/webhooks/   ← Stripe webhook
    privacy/, terms/  ← legal pages (public)
  components/
    landing/        ← landing page sections (phone mockups etc.)
    help/           ← floating HelpWidget with curated Q&A
    ui/             ← reusable UI primitives
    nav-tab-link.tsx
  features/         ← feature modules (server actions, components, types)
    ai-insights/    ← Gemini-powered journal analysis (PRO)
    checklist/      ← pre-trade checklist (PRO)
    calculator/, journal/, prop-firm/, economic-calendar/
    analytics/      ← chart components
    billing/        ← Stripe checkout + tier resolution
    settings/
  lib/
    supabase/       ← browser, server, middleware, admin clients
    gemini.ts       ← Gemini client (lazy-init Proxy)
    stripe.ts       ← Stripe client (lazy-init Proxy)
  middleware.ts     ← refreshes auth on every request + gates protected routes
supabase/migrations/  ← numbered SQL migrations (0001…0005)
```

---

## Conventions (don't break these)

### SDK clients use a lazy-init Proxy

`src/lib/gemini.ts` and `src/lib/stripe.ts` both follow this pattern:
- The default export is a `Proxy` that initializes the real client on first
  property access.
- Missing env vars throw at request time with a clear error message
  pointing the user to where to get the key.
- This is intentional. **Do not change it to eager initialization** — it
  would break `next build` whenever an env var is missing.

### Server Actions for mutations

We use Server Actions (`"use server"`) for all writes. Each feature module
has an `actions.ts` (or `server.ts` for read-side server helpers). Don't
introduce REST API routes for things a Server Action can do.

### Pro tier gating happens server + client

- Server: `import { getUserTier } from "@/features/billing/tier"`. Returns
  `{ isPaid: boolean, ... }`. Use it in Server Actions before doing anything
  Pro-only.
- Client: gate the UI with `<UpgradePrompt />` so free users see a pitch
  instead of broken/empty Pro features.

### Supabase auth is async

In Next.js 15, `cookies()` is async, so `createClient()` from
`@/lib/supabase/server` is async too:
```ts
const supabase = await createClient(); // ← always await
```

### RLS everywhere

Every user-scoped table has Row Level Security policies tied to
`auth.uid()`. Never write SQL that bypasses this. The only exception is
`src/lib/supabase/admin.ts` (service-role client) used in the Stripe
webhook for writes the user couldn't make themselves.

### AI insights specifics

- Rate-limited 5 generations per 24h per user (independent of Gemini quota)
- Requires ≥5 trades to analyze
- Analyzes up to 100 most recent trades (to stay under token budget)
- Uses Gemini's `responseSchema` for guaranteed structured JSON output —
  do NOT remove this in favor of parsing markdown
- Persists to `ai_journal_insights` table with token counts

### Comments explain *why*, not *what*

See `src/lib/gemini.ts`, `src/features/ai-insights/actions.ts`, and the
middleware for the voice. Conversational, senior-dev tone. Reference
real-world reasoning (free tier limits, build behavior, etc.). Don't
write "// fetch the user" above `const user = ...`.

### No emojis in code or copy

Unless Matt explicitly asks for them. He hasn't.

---

## Database

Supabase Postgres. Migrations are numbered SQL files in
`supabase/migrations/`. Apply them via the Supabase dashboard SQL editor.

Current tables (as of `0005_ai_journal_insights.sql`):

| Migration | Tables |
|-----------|--------|
| 0001 | `trades` (the journal) |
| 0002 | `prop_firm_configs` (per-user prop firm rules) |
| 0003 | `subscriptions` (Stripe state — synced via webhook) |
| 0004 | `user_checklist_items` (pre-trade checklist) |
| 0005 | `ai_journal_insights` (Gemini analysis history) |

Every table has `user_id uuid references auth.users(id) on delete cascade`
and RLS enabled.

---

## Environment variables

See `.env.example` for the canonical list. Notable ones:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public
- `SUPABASE_SERVICE_ROLE_KEY` — server-only, used in the Stripe webhook
- `NEXT_PUBLIC_SITE_URL` — used for Stripe redirect URLs + password-reset emails
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` — server-only
- `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`, `NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID`
- `GEMINI_API_KEY` — server-only. Get free at
  https://aistudio.google.com/app/apikey

Locally: `.env.local`. In production: Vercel project env vars.

---

## Deployment

- Hosted on Vercel. Pushing to `main` auto-deploys.
- Stripe webhook endpoint is `/api/webhooks/stripe`. The `STRIPE_WEBHOOK_SECRET`
  in Vercel must match the webhook configured in the Stripe dashboard.
- Production uses live Stripe keys (`sk_live_…`, `pk_live_…`).

---

## How to verify a change before committing

```bash
npm run build   # type-check + production build. MUST pass.
```

Don't commit code that fails `npm run build`. ESLint warnings are OK to
ship if they're pre-existing or stylistic.

---

## Git conventions

- Commit messages: sentence-case, imperative ("Switch AI insights from
  Anthropic to Google Gemini free tier"). No `feat:` / `fix:` prefixes.
- Subject line ≤ ~70 chars. Body explains the *why*.
- Always create new commits — never `--amend` unless explicitly asked.
- Co-author Claude when relevant: `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>`
