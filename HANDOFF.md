# Handoff notes — current state + pending work

This is the short-lived companion to `CLAUDE.md`. Update it as work
progresses. When picking up a session, read this *after* `CLAUDE.md` to
get oriented on what's in flight.

Last meaningful update: **2026-05-16** — moved dev environment from
MacBook to Dell laptop; switched AI from Anthropic to Gemini.

---

## Where we are right now

- **All code work committed + pushed to `main`.** Vercel has auto-deployed.
- The Coach tab (Pro-only checklist + AI insights) is **shipped and live**
  but requires two production-side cleanups before it actually works for
  paying users — see "Pending work" below.
- Dev environment has been migrated from a MacBook to a Dell laptop
  running WSL2 Ubuntu. The project lives at
  `/home/matt1/projects/tradeos` on the Dell. Day-to-day interaction
  happens via the Claude Desktop app for Windows pointed at the WSL path
  `\\wsl.localhost\Ubuntu\home\matt1\projects\tradeos`. Backup access via
  SSH from iPhone (Tailscale + Termius + tmux) is configured.

---

## Pending work (do these next)

### 1. Vercel env var swap — BLOCKING for production AI insights

The Vercel project still has the old `ANTHROPIC_API_KEY` env var and is
missing `GEMINI_API_KEY`. Until this is fixed, AI insight generation on
the live site will fail with "GEMINI_API_KEY is not set".

Steps (Matt to do, or Claude to walk him through):
1. Get a free Gemini API key at https://aistudio.google.com/app/apikey
2. Vercel dashboard → TradeOS project → Settings → Environment Variables
3. **Delete** `ANTHROPIC_API_KEY`
4. **Add** `GEMINI_API_KEY` with the key from step 1. Scope:
   Production + Preview + Development.
5. Redeploy (Deployments → ⋯ → Redeploy on latest, OR push any commit).

### 2. Supabase migrations 0004 + 0005

Two migrations may not yet have been run on the production Supabase
project. Without them, the Coach tab will throw "relation does not exist"
errors for `user_checklist_items` and `ai_journal_insights`.

Steps:
1. Supabase dashboard → SQL Editor
2. Run `supabase/migrations/0004_user_checklist.sql`
3. Run `supabase/migrations/0005_ai_journal_insights.sql`
4. Verify both tables show up under Table Editor with RLS enabled.

(If they were already run earlier, the SQL will error harmlessly — both
migrations use `create table if not exists`.)

---

## Recent decisions worth knowing

### AI vendor: Gemini, not Anthropic

We switched in May 2026 because Anthropic requires paid credit and Matt
didn't want to pay. Gemini 2.5 Flash on the free tier covers early-stage
usage (1500 req/day, 15 req/min) at $0. The `lib/anthropic.ts` file was
deleted; `lib/gemini.ts` replaced it; the `ai-insights/actions.ts` was
rewritten to use Gemini's `responseSchema` for guaranteed JSON output.

**Do not propose switching back to Anthropic** unless Matt explicitly asks.

### Pro features live in `/coach`, not bolted onto Calc/Journal

Earlier we considered embedding the pre-trade checklist into the
calculator and AI insights into the journal. Matt vetoed that
approach — the Pro features now have their own `/coach` tab in the
bottom nav. The narrative is "Pro gives you the Coach tab," not "Pro
sprinkles features around the app." Don't move them back.

### Bottom nav is 6 tabs (grid-cols-6)

`Home · Calc · Journal · Coach · Prop · Econ`. Adding a 7th tab will
break the responsive layout on small phones — don't do it without
discussing. The Settings page is reached via the gear icon in the top
header, not the bottom nav.

### Stripe is in LIVE mode

`STRIPE_SECRET_KEY` in production is a `sk_live_…` key, not test. Real
customer payments flow through. Be careful with any Stripe-related
changes — bugs cost real money. Test keys are still used in
`.env.local` for local development.

### No chart library

All charts (P&L curve, win rate, etc.) are custom SVG in
`src/features/analytics/`. We deliberately don't depend on Recharts /
Chart.js / etc. Don't add one.

### HelpWidget uses curated Q&A, not AI

There's a floating help widget on the landing + auth pages. It answers
common questions from a hard-coded list. No LLM calls — kept the
landing page LLM-free for cost reasons. Don't "upgrade" it to call
Gemini/Claude without asking.

---

## Dev environment quirks (Dell + WSL)

- Project lives in WSL filesystem at `/home/matt1/projects/tradeos`. From
  Windows, this is `\\wsl.localhost\Ubuntu\home\matt1\projects\tradeos`.
- Node 20 LTS installed via nvm in WSL. **Don't use Windows-native Node** for
  this project — package binaries in `node_modules` are Linux.
- `npm run dev` from inside WSL runs at http://localhost:3000 and is
  reachable from a Windows browser thanks to WSL's auto-port-forwarding.
- WSL is configured to never auto-shutdown
  (`%USERPROFILE%\.wslconfig` has `vmIdleTimeout=-1`), so the dev server
  keeps running 24/7 once started.
- Tailscale is installed on Windows side AND inside WSL. The WSL device
  is named `matt1-1` on the tailnet (Windows is `matt1`). SSH from
  iPhone Termius uses the WSL hostname.
- `tmux` is installed for keeping Claude sessions alive across phone
  disconnects: `tmux new -s claude` → work → `Ctrl+B D` to detach →
  `tmux attach -t claude` to resume.

---

## Things that might confuse a fresh Claude session

- The repo's `package.json` `name` is `"futures-calc-next"` — that's the
  original project name before it became TradeOS. Don't rename it
  (would break Vercel project linking).
- There's a `.env.example` with placeholder values AND a `.env.local`
  (gitignored) with real values. Only `.env.example` is in the repo.
- The HelpWidget's contents are hand-curated in `src/components/help/`
  — if Matt asks to "update the help answers," edit that file, don't
  build a CMS.
- Inline comments in code use a conversational senior-dev voice (see
  `src/lib/gemini.ts`, `src/features/ai-insights/actions.ts`). Match it
  when adding new comments.
