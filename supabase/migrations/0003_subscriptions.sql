-- Subscription state per user. One row per user (PK on user_id).
-- Webhooks (running server-side with the service role key) write to this table;
-- users can only read their own row (RLS).

create table if not exists public.subscriptions (
    user_id                  uuid primary key references auth.users(id) on delete cascade,

    -- 'free' | 'pro' | 'lifetime'
    tier                     text not null default 'free' check (tier in ('free', 'pro', 'lifetime')),

    -- Mirrors Stripe subscription status: 'active' | 'past_due' | 'cancelled' | 'trialing' | 'incomplete' | 'unpaid'
    status                   text not null default 'active',

    stripe_customer_id       text unique,
    stripe_subscription_id   text unique,
    current_period_end       timestamptz,
    cancel_at_period_end     boolean not null default false,

    updated_at               timestamptz not null default now()
);

create index if not exists subscriptions_stripe_customer_idx
    on public.subscriptions (stripe_customer_id);

-- Reuse the updated_at trigger function (defined in migration 0001).
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
    before update on public.subscriptions
    for each row execute function public.handle_updated_at();

-- RLS: read-only for users; writes are done by the webhook with the service role key.
alter table public.subscriptions enable row level security;

drop policy if exists "Users see own subscription" on public.subscriptions;
create policy "Users see own subscription"
    on public.subscriptions for select
    using (auth.uid() = user_id);
-- Intentionally NO insert/update/delete policies for users.
-- Only the service role (webhook) writes to this table.
