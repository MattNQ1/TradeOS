# TradeOS — Public launch checklist

A concrete, ordered list of what to verify before going public, what to
announce on launch day, and what to monitor in the first week.

Maintained in this repo so it gets committed alongside any launch-related
code changes. Tick items as you go.

---

## Phase 0 — Pre-launch verification (do all of these BEFORE announcing)

### Production environment

- [ ] **Vercel env vars set correctly**
  - Go to Vercel → TradeOS project → Settings → Environment Variables
  - Required (all three scopes — Production + Preview + Development):
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `SUPABASE_SERVICE_ROLE_KEY`
    - `NEXT_PUBLIC_SITE_URL` (set to your real domain, e.g. `https://usetradeos.com` if you have one, else the Vercel URL)
    - `STRIPE_SECRET_KEY` (LIVE key, `sk_live_…`)
    - `STRIPE_WEBHOOK_SECRET` (matches the live webhook in Stripe dashboard)
    - `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` (live `price_…`)
    - `NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID` (live `price_…`)
    - `GEMINI_API_KEY`
  - Confirm `ANTHROPIC_API_KEY` is **NOT** set (we switched to Gemini).

- [ ] **Supabase migrations applied to production**
  - Supabase dashboard → SQL Editor → confirm these tables exist with RLS:
    - `trades`, `prop_firm_configs`, `subscriptions`, `user_checklist_items`, `ai_journal_insights`
  - If any are missing, run `supabase/migrations/000X_*.sql` in order.

- [ ] **Stripe webhook is configured and pointed at production**
  - Stripe dashboard → Developers → Webhooks
  - Endpoint URL: `https://usetradeos.vercel.app/api/webhooks/stripe` (or your real domain)
  - Events: at minimum `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
  - Copy the signing secret → set as `STRIPE_WEBHOOK_SECRET` in Vercel.

- [ ] **Email confirmation is enabled in Supabase**
  - Supabase → Authentication → Providers → Email
  - "Confirm email" must be ON. Otherwise new signups can use the app without verifying.
  - "Site URL" should match `NEXT_PUBLIC_SITE_URL`.
  - Redirect URLs include: `${SITE_URL}/auth/callback` (and same on localhost for dev).

- [ ] **Support email reaches you**
  - `tradeos.support@gmail.com` is referenced in: FAQ, HelpWidget, error page, Privacy + Terms.
  - Send a test email TO that address. Confirm you receive it. Reply to yourself to confirm 2-way works.
  - If you want a real domain email later (`support@usetradeos.com`), set up forwarding via Cloudflare Email Routing (free).

### Smoke tests (do these on the LIVE production URL, not localhost)

- [ ] **Signup → confirm email → sign in**
  - Use a fresh email you haven't signed up with before.
  - Click the confirmation link in the email. Land in /dashboard.
  - Welcome state appears with "Log your first trade" CTA.

- [ ] **Add one trade → see it on the journal + dashboard**
  - Calc tab: enter a hypothetical setup. Tap "Save as trade" if that flow exists, or copy values.
  - Journal tab: add a trade manually. See it on the list.
  - Dashboard: now shows analytics instead of the welcome card.

- [ ] **Try to start a Pro trial**
  - Settings → Subscription → "Try Pro free"
  - Goes to Stripe Checkout in test mode? Switch to LIVE key first.
  - Use a real card (or a Stripe-supplied live test card — see Stripe docs).
  - Returns to /settings?upgraded=pro. Banner shows.
  - Tier flips to Pro. AI tab unlocks.

- [ ] **Generate one AI insight**
  - Needs ≥5 logged trades.
  - AI tab → Generate. Should return a real analysis in ~10-15 seconds.
  - If it errors, check the Vercel logs.

- [ ] **Cancel subscription (test)**
  - Settings → Manage subscription → opens Stripe portal → cancel.
  - Confirm `cancel_at_period_end=true` is reflected in the UI.
  - Verify trial-period cancellation = no charge.

- [ ] **Sign out, then back in**
  - Confirm sign-out works.
  - Land back on `/login`. Sign in. Returns to /dashboard.

- [ ] **404 + error pages render correctly**
  - Visit `usetradeos.vercel.app/this-page-doesnt-exist` → branded 404.
  - (Triggering the global error boundary is harder to test in prod, but verify it works in dev.)

### Visual / mobile checks

- [ ] **Add to Home Screen on iPhone**
  - Open the site in Safari on your phone.
  - Share → Add to Home Screen.
  - Confirm the app icon is the emerald ▲ (not a generic Safari screenshot).
  - Confirm the splash uses the TradeOS name + theme color.

- [ ] **OG card preview**
  - Paste `https://usetradeos.vercel.app` (or your real domain) into iMessage, Twitter/X, Slack, Discord.
  - Confirm the card unfurls with the new headline + tagline (not a blank box).

- [ ] **Spot-check on 3 devices**
  - iPhone Safari
  - Desktop Chrome (1280x800+)
  - At least one Android browser if possible
  - Look for: nav overlap with safe area, text wrapping, button tap targets, modal dismissal.

---

## Phase 1 — Domain + branding polish (optional but recommended)

- [ ] **Buy a real domain if you haven't already**
  - Suggested: `usetradeos.com`, `tradeos.app`, or similar
  - Point it at Vercel (Vercel docs walk through this in 2 min)
  - Update `NEXT_PUBLIC_SITE_URL` in Vercel env vars to the new domain
  - Update Stripe webhook URL to point at the new domain
  - Update Supabase Site URL to the new domain

- [ ] **Set up Cloudflare Email Routing for support@yourdomain.com**
  - Free. Forwards `support@yourdomain.com` → your gmail.
  - Update the address in the help widget + Terms/Privacy if you switch.

---

## Phase 2 — Launch day

### Decide where you're announcing

Pick 1-3 venues, not all of them. Better to do a few well.

- [ ] **Reddit** — best bang for buck for a futures-trading product
  - `r/Daytrading` — large, somewhat skeptical of paid tools. Post a personal story, not a pitch.
  - `r/FuturesTrading` — smaller, more on-topic.
  - `r/PropFirms` — most-on-target. Mention you built it for prop firm traders.
  - Rules: Most subreddits require posts that aren't pure ads. Lead with "I built this because [story]." Mention the tool only as the solution. Reply to comments quickly.

- [ ] **Twitter / X**
  - If you have a trading audience already, this is easy: thread about the problem, then drop the link.
  - If you don't, FinTwit accounts are hard to grow cold.

- [ ] **Product Hunt**
  - Sunday/Monday launches do well. Build a hunter list of 20-30 people in advance.
  - PH audience is mostly devs/PMs — not your target — but the SEO + backlinks are real.

- [ ] **Discord communities**
  - Many prop firm Discords (Topstep, MFF, Apex) have a #tools or #recommendations channel.
  - Get permission from the mods first.

### Launch-day content prep

- [ ] **Draft a short post** for your chosen channel(s). Template:
  ```
  I built TradeOS because I [specific pain you had].
  It's [one sentence on what it does].
  Live at [URL].
  Honest feedback welcome — what's missing?
  ```

- [ ] **Screenshots** — grab 2-3 clean screenshots from the live site for the post. Mobile screenshots feel more authentic than desktop ones for a mobile-first app.

- [ ] **Be ready to respond to comments fast.** First 2 hours after posting matter most for engagement.

---

## Phase 3 — First week monitoring

### Watch these in your first 7 days post-launch

- [ ] **Vercel Analytics** (auto-installed)
  - Dashboard: https://vercel.com/dashboard → TradeOS → Analytics
  - Watch: pageviews, top pages, referrers, devices
  - Healthy: pageviews > 50/day, bounce rate < 75% on landing.

- [ ] **Vercel Logs**
  - Check at least once a day for errors.
  - Filter by 4xx/5xx responses to spot signup/login/payment failures.
  - Errors logged by `error.tsx` will surface here with `error.digest` IDs.

- [ ] **Supabase usage**
  - Dashboard → check daily active users, signups, table row counts.
  - Free tier limits: 500MB database, 2GB transfer, 50k MAU. Plenty for launch.

- [ ] **Stripe dashboard**
  - Monitor: new trials started, trial → paid conversions, churn.
  - First week target: 1+ paying customer = real validation. 5+ = exciting.

- [ ] **Support email**
  - Aim to reply within 4 hours during launch week.
  - Common questions → add to the HelpWidget Q&A so future users self-serve.

### Decide your weekly cadence after launch

- Pick ONE day to ship updates. Tuesday or Wednesday tends to work.
- Pick ONE day to read all support email + new feedback.
- Don't try to ship every day. You'll burn out.

---

## Things explicitly NOT done that you might want later

These are documented so you remember they exist, not as blockers for launch:

- **Broker auto-sync** — Parked. Requires Tradovate API costs (~$59/mo on user's account)
  + custom OAuth flow. Revisit when you have ~50 paying users asking for it.
- **Cookie consent banner** — We don't set non-essential cookies, so we don't strictly need it. Add later if you target EU/UK heavily.
- **Sentry error tracking** — Vercel logs are sufficient for v1. Add Sentry if error volume grows.
- **Cron jobs for trial-expiry emails** — Stripe handles billing emails. If you want custom "your trial ends in 24 hours" comms, build later.
- **A/B testing on landing copy** — Not worth the engineering until you have meaningful traffic. After 10k uniques, consider Vercel's Edge Config + a simple split test.
- **Public roadmap / changelog** — Skip until users actually ask for one.
- **Affiliate / referral program** — Skip until you've validated the product converts at all.

---

## Quick start

If you want the shortest possible path to "I clicked publish":

1. Do the 8 checks in **Phase 0 → Production environment + Smoke tests** (~30 min).
2. Pick **one** Reddit subreddit you frequent.
3. Write a 4-line post about the specific pain that made you build this.
4. Drop the link.
5. Reply to every comment for the first 2 hours.

That's a real launch.
