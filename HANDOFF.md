# Handoff notes — current state + pending work

This is the short-lived companion to `CLAUDE.md`. Update it as work
progresses. When picking up a session, read this *after* `CLAUDE.md` to
get oriented on what's in flight.

Last meaningful update: **2026-05-16** — second overnight run:
Coach → AI rename + brain icon, new AI showcase section on landing,
mock-phone navs updated to match real app, branded 404 / error
boundary / robots / sitemap / PWA manifest, per-page titles.

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
- **Overnight pass (2026-05-16) done:** complete de-AI sweep across
  landing + every authenticated view. Voice is now anonymous "we",
  edgy, specific. See "Overnight run summary" below for the full
  changelog.

---

## Overnight run summary — 2026-05-16

5 commits pushed while Matt was asleep. Goal: make the site feel
"human made" instead of AI-generated.

### What changed

**Commit 1 — Landing page rewrite** (`194d779`)
- Killed gradient text in all headlines (2 instances)
- Removed pulsing dot badge in hero
- New hero h1: "The trading toolkit prop firms hope you don't have."
- New hero subhead, less listy
- Removed violet wash, removed `animate-pulse-glow` on hero aura
- **NEW SECTION: "Why we built this"** — anonymous "we" founder voice,
  3-4 short paragraphs, specific trader pain (Topstep eval auto-fails,
  spreadsheet juggling)
- Rewrote 6 feature card bodies (more specific, fewer em dashes)
- Rewrote section h2s: "What's actually in it", "Made for the device
  you actually trade from", "Cheaper than one bad trade", "Questions
  before you commit"
- Cut 4 of 5 uppercase eyebrow labels
- Varied CTAs ("Try it free for 7 days", "Try Pro free", "Get
  TradeOS", "Buy once, done", "Start free")
- Cut 3 phone-row float animations on the gallery (kept hero ones)
- New final CTA h2: "Stop blowing up accounts. Start tracking the math."
- Footer tagline: "Built by prop firm traders, in the gaps between
  sessions, because nobody else was going to."
- Tightened FAQ answers (less corporate, dropped Supabase jargon)
- Fixed unused `i` lint warning in feature card map

**Commit 2 — In-app polish: Coach + auth surfaces** (`d10c97a`)
- Coach page subtitle rewritten ("Find your patterns. Run the
  checklist. Don't tilt.")
- InsightsSection: rewrote Pro pitch copy, removed 🧠 + ✨ emojis,
  toned down violet → emerald
- UpgradePrompt: tightened default copy, killed violet wash, varied CTAs
- ChecklistCard: tighter pitch copy, removed unused UpgradePrompt
  import (fixes ESLint warning)
- Analytics empty state: "Your analytics will live here..." →
  "Nothing to show yet. Log a few trades..."
- HelpWidget: dropped 👋 emojis, replaced "Online · Replies instantly"
  with "Hand-written answers, no chatbot"
- Settings post-upgrade banner: dropped 🎉 emoji

**Commit 3 — In-app polish: Calc/Journal/Prop/Econ** (`2bc0594`)
- Calculator: "Calculator" h1 → "Position calculator" + subtitle
- Journal: added subtitle ("Every trade you take. Every pattern you
  keep missing.")
- Journal trade-limit paywall: tightened copy
- Broker-sync modal: dropped 🔌 emoji decoration, replaced ✕ glyph
  with SVG, demoted uppercase eyebrows to plain paragraphs
- Prop firm: added subtitle ("Daily limits, drawdown, profit
  targets — tracked so you don't blow up by accident.")
- Economic calendar: title case fix, subtitle rewritten, dropped
  📡/📅 emoji decorations
- Calendar paywall: rewrote with new voice

**Commit 4 — OG image + favicon + metadata** (`5774132`)
- **NEW: `src/app/opengraph-image.tsx`** — generated 1200x630 OG card
  rendered at request time via `next/og`. Dark emerald background,
  ▲ + TradeOS wordmark, the new headline, the tagline.
- **NEW: `src/app/icon.tsx`** — 32x32 favicon (emerald ▲ on dark)
- **NEW: `src/app/apple-icon.tsx`** — 180x180 Apple touch icon for
  iOS "Add to Home Screen"
- Root layout metadata: added metadataBase, title template ("%s ·
  TradeOS"), keywords, openGraph, twitter, robots
- Removed redundant page-level metadata from `src/app/page.tsx`
  (handled by root layout now)

**Commit 5 — Settings + CSV modal final polish** (`b8a87a1`)
- Subscription section: removed floating 🎁 / ⭐ / 🏆 emoji
  decorations from the active subscription and Lifetime cards
- Upgrade card copy: varied CTAs ("Try Pro free", "Buy once, done"),
  reworded feature lines, replaced violet with emerald
- CSV modal: removed pulsing 📥 emoji, tightened subtitles
- Data section: dropped "stored on Supabase" jargon for plain wording

**Commit 6 — Insights + profit target: kill remaining emojis** (`589a740`)
- InsightBlock + SinglePoint components: removed the `icon` prop. The
  📈/✨/📊/🎯 emoji "icons" on AI insight sections were a strong AI
  tell. Color-coded eyebrows already differentiate sections visually.
- Renamed two section headers for directness:
  - "Emotional alerts" → "Watch for"
  - "Improvements" → "Doing better"
- profit-target.tsx: "🎉 Profit target reached!" → "Profit target hit.
  You're funded."

**Commit 7 — EventModal + TradeList polish** (`6445404`)
- EventModal paywall variant (free user taps a gated econ event):
  removed 🔒 emoji, toned violet → emerald, replaced ✕ with real SVG,
  rewrote headline ("This one's behind Pro") + subtitle + CTAs.
- Main EventModal hero close-button ✕ also replaced with SVG.
- TradeList empty state: dropped 📓 emoji, tightened copy.

**Commit 8 — CSV modal final emoji cleanup** (`6cbeb83`)
- File picker drop zone: dropped 📄 emoji decoration (the dashed
  border already signals "drop file here")
- Done stage: dropped ✅ emoji, tightened success copy

---

## Second overnight run — 2026-05-16 (after Matt verified AI works)

After Matt verified the AI insights fix worked, he went back to bed
and asked Claude to keep polishing. Eleven more commits.

**AI insights JSON-truncation fix** (`95e6381`)
- Gemini 2.5 Flash's "thinking" mode was eating output tokens before
  the JSON response even started, truncating it mid-string and
  causing "Unterminated string in JSON at position 156" parse errors.
- Bumped maxOutputTokens 1024 → 4096
- Added `thinkingConfig: { thinkingBudget: 0 }` to disable thinking
  for this structured-extraction task (no chain-of-thought needed)
- Surfaces "ran past length limit" if finishReason === MAX_TOKENS
- Wraps JSON.parse in its own try/catch with better logging

**Bottom nav redesign** (`d52849e`)
- Was text-only labels. Now has Lucide-style inline-SVG icons stacked
  above each label, active:scale-95 tap feedback, safe-area padding
  for iPhone home-indicator, per-tab aria-label, nav aria-label.

**Coach → AI rename + brain icon** (linter applied)
- Tab label changed from "Coach" to "AI", icon swapped from compass
  to two-lobed brain. Route stays `/coach` for stability (middleware,
  revalidatePath calls). Page heading on /coach is now "AI".
- Vercel "edge runtime disables static generation" warning fixed by
  removing `export const runtime = "edge"` from opengraph-image.tsx,
  icon.tsx, apple-icon.tsx.

**AICoach landing section + mock nav update** (`71d2e5e`)
- Landing page got a prominent AICoach section between Hero and the
  feature grid. Split layout: left has copy + 4-bullet list of what
  the AI does, right has a styled mock insight card with real-looking
  example output (Patterns / Watch for / Strongest setup).
- Replaces the previous "Why we built this" section (deleted).
- Mock phone screens on the landing now show the new 6-tab nav
  (Home/Calc/Journal/AI/Prop/Econ) with tiny 12px icons matching the
  real app. Defined in mock-screens.tsx as Tiny*Icon components.

**Feature grid header reframed** (`d0f58e1`)
- "What's actually in it / Six tools, one tab" → "The rest of the
  toolkit / Six more tools beyond the AI" so the narrative flows
  from AICoach hero into the grid.
- CLAUDE.md + HANDOFF.md updated for the AI tab rename.

**404 + robots + sitemap** (`342902e`)
- src/app/not-found.tsx: branded 404 with TradeOS aesthetic and
  back-to-home / back-to-dashboard CTAs.
- src/app/robots.ts: auto-served /robots.txt, allows /, disallows
  the auth-gated app routes.
- src/app/sitemap.ts: auto-served /sitemap.xml, lists the 5 public
  pages with priorities + change frequencies.

**PWA manifest + global error boundary** (`67a3e6c`)
- src/app/manifest.ts: auto-served /manifest.webmanifest. Makes
  "Add to Home Screen" render with the TradeOS name, brain ▲ icon,
  emerald theme. start_url goes to /dashboard.
- src/app/error.tsx: branded global error boundary. Shows
  error.digest for support tickets, has a "Try again" button that
  calls Next's reset(), plus back-to-homepage Link.

**Per-page browser-tab titles** (`2f34c47`)
- All 11 (app), (auth), privacy, terms pages now set their own
  metadata.title. Root layout's "%s · TradeOS" template wraps each
  one. So bookmarks/tabs now read "Calculator · TradeOS" etc.
  instead of every tab showing the homepage title.
- Privacy + Terms had hardcoded "X · TradeOS" titles that were
  being double-suffixed by the root template ("X · TradeOS ·
  TradeOS"). Fixed.

Final state: `npm run build` clean. Zero ESLint warnings. 19 commits
total pushed over the two overnight runs.

### What didn't change

- Functionality, logic, routes, database, env vars, Stripe, Gemini
  call patterns. Pure copy + visual tweaks only.
- Auth pages (login/signup/forgot/reset) were reviewed and found
  clean — no AI tells.
- The "✓" check / "•" bullet markers are kept (functional, not
  decorative).
- Domain-specific labels (Win rate, Profit factor, Trailing
  drawdown, etc.) are kept verbatim — those are correct trader
  vocabulary.

### Build verified at each step

`npm run build` ran clean after every batch. Three pre-existing
ESLint warnings were fixed along the way. No new ones introduced.

---

## Pending work — Matt to do when he wakes up

These are the only things blocking Coach features from working in
production. Both should take under 5 minutes total.

### 1. Vercel env var swap — BLOCKING for production AI insights

The Vercel project still has the old `ANTHROPIC_API_KEY` env var and is
missing `GEMINI_API_KEY`. Until this is fixed, AI insight generation on
the live site will fail with "GEMINI_API_KEY is not set".

Steps:
1. Get a free Gemini API key at https://aistudio.google.com/app/apikey
   (click "Create API key" → "Create API key in new project" → copy)
2. Vercel dashboard → TradeOS project → Settings → Environment Variables
3. **Delete** `ANTHROPIC_API_KEY`
4. **Add** `GEMINI_API_KEY` with the key from step 1. Scope: Production
   + Preview + Development.
5. Redeploy: Deployments → ⋯ → Redeploy on latest. (OR just push any
   commit, that triggers a deploy too.)

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

### 3. (Optional) Visual review of the new landing page

The de-AI rewrite changed a lot of copy. Open
https://usetradeos.vercel.app/ once Vercel deploys and skim — flag
anything that reads wrong, sounds off-brand, or you want toned down.
Specific things to check:
- New hero h1: "The trading toolkit prop firms hope you don't have."
  (slightly conspiratorial — you OK with this framing?)
- "Why we built this" section claims you've blown up funded accounts.
  This is the "honest founder" angle. Want to soften?
- Final CTA: "Stop blowing up accounts. Start tracking the math."
- New OG card unfurls — paste the URL into iMessage or Twitter to
  preview how shares look.

### 4. (Optional) Visual review of the Dell setup

If you used the Claude Desktop app to point at the WSL project, run
`git pull` on the Dell so it picks up all the overnight commits,
then open a new session and verify everything looks right.

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
approach — the Pro features now have their own tab in the bottom
nav. The narrative is "Pro gives you the AI tab," not "Pro
sprinkles features around the app." Don't move them back.

### Tab is called "AI" but the route is /coach

The bottom-nav tab label was changed from "Coach" → "AI" with a brain
icon (per Matt). The route stays `/coach` for stability — middleware
references, server actions doing `revalidatePath("/coach")`, etc.
all still point at `/coach`. Only the visible label + icon were
changed. Don't rename the route unless asked.

### Bottom nav is 6 tabs (grid-cols-6)

`Home · Calc · Journal · AI · Prop · Econ`. Adding a 7th tab will
break the responsive layout on small phones — don't do it without
discussing. The Settings page is reached via the gear icon in the top
header, not the bottom nav.

Each tab has a Lucide-style inline-SVG icon: house / calculator /
open-book / brain / shield / calendar. Defined in
`src/components/nav-tab-link.tsx`.

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
