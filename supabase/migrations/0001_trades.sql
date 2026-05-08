-- Trades table for the journal feature.
-- Run this in the Supabase SQL editor (Database → SQL Editor → New query → paste → Run).

create table if not exists public.trades (
    id              uuid primary key default gen_random_uuid(),
    user_id         uuid not null references auth.users(id) on delete cascade,

    date            date not null,
    contract        text not null,
    direction       text not null check (direction in ('long', 'short')),
    contracts       integer not null check (contracts > 0),
    entry_price     numeric not null,
    exit_price      numeric not null,

    commission      numeric not null default 0,
    planned_risk    numeric,
    notes           text,

    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

-- Index optimized for the most common query: "my trades, newest first".
create index if not exists trades_user_date_idx
    on public.trades (user_id, date desc);

-- Auto-bump updated_at on row update.
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists trades_set_updated_at on public.trades;
create trigger trades_set_updated_at
    before update on public.trades
    for each row execute function public.handle_updated_at();

-- Row Level Security — every trader sees only their own trades.
alter table public.trades enable row level security;

drop policy if exists "Users see own trades"      on public.trades;
drop policy if exists "Users insert own trades"   on public.trades;
drop policy if exists "Users update own trades"   on public.trades;
drop policy if exists "Users delete own trades"   on public.trades;

create policy "Users see own trades"
    on public.trades for select
    using (auth.uid() = user_id);

create policy "Users insert own trades"
    on public.trades for insert
    with check (auth.uid() = user_id);

create policy "Users update own trades"
    on public.trades for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users delete own trades"
    on public.trades for delete
    using (auth.uid() = user_id);
