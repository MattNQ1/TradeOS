-- Pre-trade checklist items. One row per item per user.
-- Pro-only feature; the Server Action checks tier before allowing writes.
-- Reads still allowed for everyone (so we can show the empty state).

create table if not exists public.user_checklist_items (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid not null references auth.users(id) on delete cascade,
    text        text not null check (length(text) between 1 and 200),
    position    integer not null default 0,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

create index if not exists user_checklist_user_position_idx
    on public.user_checklist_items (user_id, position);

-- Reuse the updated_at trigger function from earlier migrations.
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists user_checklist_items_set_updated_at on public.user_checklist_items;
create trigger user_checklist_items_set_updated_at
    before update on public.user_checklist_items
    for each row execute function public.handle_updated_at();

-- RLS: users read/write only their own items.
alter table public.user_checklist_items enable row level security;

drop policy if exists "Users see own checklist" on public.user_checklist_items;
drop policy if exists "Users insert own checklist" on public.user_checklist_items;
drop policy if exists "Users update own checklist" on public.user_checklist_items;
drop policy if exists "Users delete own checklist" on public.user_checklist_items;

create policy "Users see own checklist"
    on public.user_checklist_items for select
    using (auth.uid() = user_id);

create policy "Users insert own checklist"
    on public.user_checklist_items for insert
    with check (auth.uid() = user_id);

create policy "Users update own checklist"
    on public.user_checklist_items for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users delete own checklist"
    on public.user_checklist_items for delete
    using (auth.uid() = user_id);
