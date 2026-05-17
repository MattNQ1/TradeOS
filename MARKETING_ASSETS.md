# Marketing assets — Instagram + TikTok launch

Everything you need to launch on social. Generated assets live at runtime
under `/marketing/*` routes (gated from search engines via robots.txt).

---

## Instagram carousel — screenshot the slides

Visit ONE URL in Chrome (works on phone too but desktop is easier):

**https://usetradeos.vercel.app/marketing/carousel**

You'll see 5 slides stacked vertically, each rendered at native 1080×1350
using the **actual landing-page phone mockups** (same components as the
real site). Real components, pixel-perfect — not Satori approximations.

### How to download each slide as PNG

**Best quality (recommended):** Chrome DevTools

1. Right-click any slide → **Inspect**
2. In the DevTools Elements panel, find the highlighted `<section data-slide="N">` element
3. Right-click that element → **"Capture node screenshot"**
4. PNG downloads at native 1080×1350 resolution

**Easier fallback:** macOS screenshot tool

1. Press **⌘ + Shift + 4** (Cmd-Shift-4)
2. Drag a box around the slide
3. Crop / resize after if needed (most photo apps can handle this)

On Windows: **Windows + Shift + S** then box-select.

Save them as `slide-1.png` through `slide-5.png`.

Slide flow:
- **1. Hook** — "You're juggling 4 apps to manage one funded account."
- **2. Problem** — lists the 4 apps prop firm traders cobble together.
- **3. Solution** — "One app does all of it" + 5 bullets.
- **4. AI differentiator** — Pro feature showcase with sample AI outputs.
- **5. CTA** — "Try it free" + URL.

### Posting to Instagram

1. Open Instagram → new post → tap the multi-photo icon
2. Select **all 5 slides in order** (1 → 5)
3. Pick the first thumbnail as cover (Instagram defaults to it anyway)
4. Caption + hashtags below

### Caption (copy-paste)

```
built this because i was juggling 4 different apps and a notes file just 
to trade my MFF account. one tool now does all of it — position sizing, 
trailing drawdown tracking, journal, prop firm rules per account, AI 
insights that read your trades and tell you what's actually working.

free tier covers most of it. pro's $19/mo with a 7-day trial.

usetradeos · link in bio

what's missing? what would you want to see added? lmk 👇

#propfirmtrading #futurestrader #daytrading #propfirms #topstep
```

### Hashtag stack for the first-comment

Drop these in a reply on your own post (Instagram doesn't penalize this and
keeps the caption clean):

```
#apextraderfunding #myfundedfutures #mff #ftmo #tradingjournal 
#fintok #tradersoftiktok #tradingsetup #propfirmtrader #micros 
#futurestrading #tradingtools #tradinglife #daytradertools #tradingapp
```

---

## TikTok / Instagram Reels — teleprompter script

A clean 30-second script optimized for reading off your phone while
filming. Hold your phone vertically, frame yourself in the top third,
read this off a second screen.

> **[0–3s — HOOK, look at camera]**
> 
> If you've ever blown a prop firm eval because the trailing drawdown
> ratcheted up after one of your winners — this is for you.
> 
> **[3–10s — PROBLEM, b-roll of your messy desk + apps]**
> 
> Most prop firm traders are tracking their daily loss, their trailing
> drawdown, and their profit target across like four different apps.
> A calculator here. Excel journal there. Notes app for the rules. Econ
> calendar in another tab.
> 
> **[10–22s — REVEAL, screen-recording of TradeOS]**
> 
> So I built one app that does all of it. Position sizing for every
> contract. Journal that tracks trailing drawdown to the dollar. Presets
> for Topstep, Apex, MFF, FTMO. And an AI tab that reads your trades and
> tells you what's actually working — and what's bleeding you.
> 
> **[22–30s — CTA, back to camera]**
> 
> Free tier covers most of it. Pro's $19/mo with a 7-day trial. Link's
> in my bio. Roast it if you want — I'm listening.

### What to capture as b-roll during filming

Screen-record yourself doing each of these in TradeOS for 3–5 seconds each:

1. Dashboard with the equity curve and total P&L
2. Calc tab — type in a trade, contracts auto-calculate
3. Prop tab — switch firm preset, drawdown card updates
4. AI tab — tap Generate, insights appear

You'll edit these clips in over the voiceover during the "REVEAL" section.

### TikTok caption

```
trade prop firm futures? you're tracking 3 things at once and most 
tools track none of them well.

built one app that does all of it. free tier on the site (link in bio).

#propfirmtrading #futurestrader #daytrader #propfirms #topstep 
#apextraderfunding #mff #ftmo #fintok #tradingsetup
```

### Filming tips (so this doesn't take 4 hours)

- Use your phone, not a real camera. Algorithm rewards authentic-feeling content.
- Vertical 9:16 — don't film horizontal then crop.
- Add captions / on-screen text — most viewers watch with sound off.
- Browse TikTok's "Trending" sounds and pick one with low BPM you can talk over.
- Post at 8am ET (pre-market) or 4-6pm ET (post-close) for trader audience.
- **Reply to every comment for the first 2 hours.** Engagement = reach.

### What to NOT do

- ❌ AI-voice narration. People can tell.
- ❌ "Revolutionary," "game-changing," "transform your trading."
- ❌ Fake P&L numbers — futures traders will crucify you.
- ❌ Tag the prop firms (@Topstep etc.) — looks desperate.
- ❌ Post identical content to TikTok and Reels the same day. Stagger by 24h.

---

## Enabling Vercel Analytics (so you can see views)

The code is already wired up (`@vercel/analytics` package installed,
`<Analytics />` component in the root layout) — but Vercel doesn't actually
collect data until you flip the switch in the dashboard.

### One-time setup (~2 minutes)

1. Go to https://vercel.com/dashboard
2. Click your **TradeOS** project
3. Click the **Analytics** tab in the top nav
4. Click **Enable Analytics**
5. Pick the **Hobby (free)** plan — gives you basic visit data, no cost
6. Done. Data starts collecting on the next pageview.

### What you'll see

Once enabled, the Analytics tab shows:

- **Visitors** — unique people in last 24h / 7d / 30d
- **Page views** — total loads
- **Top pages** — usually `/` (landing) will be #1
- **Top referrers** — where traffic comes from (Reddit, TikTok, Instagram, direct)
- **Devices / OS / browsers** — mobile vs desktop split
- **Countries** — geo breakdown

No setup required — just enable + wait. First data appears within minutes
of your first post-deploy pageview.

### Privacy note

Vercel Analytics is privacy-friendly: no cookies, no fingerprinting, no
personal data, no cross-site tracking. Doesn't require a cookie banner.
Aligns with the "we don't sell your data" claim in the help widget.

---

## Suggested launch order

1. **Enable Vercel Analytics** (5 min) — so you can measure everything that follows
2. **Post to Reddit r/PropFirms** (15 min) — see post templates in launch checklist
3. **Wait 24 hours, post the IG carousel** (10 min) — using slides from `/marketing/slide?n=1..5`
4. **Wait another 24 hours, film + post the TikTok** (30-45 min) — using script above
5. **Cross-post the TikTok to IG Reels** 24 hours after it goes up on TikTok

Each platform pushes the next batch of traffic to the live site. Analytics
will show you which channel converts best.
