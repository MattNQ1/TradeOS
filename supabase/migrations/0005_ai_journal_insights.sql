-- AI journal insights cache.
-- Each row = one AI analysis run on the user's trade journal.
-- Lets us:
--   1. Show the most recent insight on page load without re-running
--   2. Rate-limit users (count rows in last 24h)
--   3. Track history of insights over time (later: "see what changed since last week")

create table if not exists public.ai_journal_insights (
    id                 uuid primary key default gen_random_uuid(),
    user_id            uuid not null references auth.users(id) on delete cascade,

    -- How many trades were in the analysis input.
    trades_analyzed    integer not null default 0,

    -- Structured insight fields. JSONB so we can evolve the schema without a migration.
    patterns           jsonb not null default '[]'::jsonb,
    emotional_alerts   jsonb not null default '[]'::jsonb,
    improvements       jsonb not null default '[]'::jsonb,
    session_comparison text,
    strongest_setup    text,

    -- One-line headline, useful for a "latest insight" badge.
    summary            text,

    -- Cost tracking (optional but cheap to keep).
    input_tokens       integer,
    output_tokens      integer,

    created_at         timestamptz not null default now()
);

create index if not exists ai_journal_insights_user_created_idx
    on public.ai_journal_insights (user_id, created_at desc);

-- RLS: users read their own; only the server (using authed session) writes.
alter table public.ai_journal_insights enable row level security;

drop policy if exists "Users see own insights"   on public.ai_journal_insights;
drop policy if exists "Users insert own insights" on public.ai_journal_insights;

create policy "Users see own insights"
    on public.ai_journal_insights for select
    using (auth.uid() = user_id);

create policy "Users insert own insights"
    on public.ai_journal_insights for insert
    with check (auth.uid() = user_id);
