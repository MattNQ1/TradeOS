-- One row per user holding their prop-firm preset selection + custom rules.
-- The table is keyed by user_id (PK), so the upsert pattern is trivial.
-- Run this in the Supabase SQL editor.

create table if not exists public.prop_firm_config (
    user_id              uuid primary key references auth.users(id) on delete cascade,

    -- 'none', 'custom', or a preset id like 'topstep-50k' (kept opaque to the DB)
    preset               text not null default 'none',

    -- Custom rule values (only used when preset = 'custom')
    custom_account_size  numeric not null default 0,
    custom_target        numeric not null default 0,
    custom_max_loss      numeric not null default 0,
    custom_daily         numeric not null default 0,
    custom_trailing      numeric not null default 0,

    updated_at           timestamptz not null default now()
);

-- Reuse the updated_at trigger function created in 0001_trades.sql.
-- (Re-create it here so this migration is independently runnable.)
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists prop_firm_config_set_updated_at on public.prop_firm_config;
create trigger prop_firm_config_set_updated_at
    before update on public.prop_firm_config
    for each row execute function public.handle_updated_at();

-- Row Level Security — each user sees/edits only their own config row.
alter table public.prop_firm_config enable row level security;

drop policy if exists "Users see own prop config"     on public.prop_firm_config;
drop policy if exists "Users insert own prop config"  on public.prop_firm_config;
drop policy if exists "Users update own prop config"  on public.prop_firm_config;

create policy "Users see own prop config"
    on public.prop_firm_config for select
    using (auth.uid() = user_id);

create policy "Users insert own prop config"
    on public.prop_firm_config for insert
    with check (auth.uid() = user_id);

create policy "Users update own prop config"
    on public.prop_firm_config for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
