-- VibeGuard: Row-Level Security baseline. (VG-002, VG-003)
-- RLS is the single most important Supabase control: without it, anyone with the
-- public anon key can read/write whole tables. Enable it and write per-user policies.

-- Example owner-scoped table.
create table if not exists public.items (
  id          uuid primary key default gen_random_uuid(),  -- non-guessable id (VG-002)
  owner_id    uuid not null references auth.users (id) on delete cascade,
  title       text not null,
  note        text,
  created_at  timestamptz not null default now()
);

-- 1) Turn RLS ON. Until policies exist, this denies all access by default (fail closed).
alter table public.items enable row level security;

-- 2) Per-user policies: a user may only touch their OWN rows. (VG-002, VG-003)
create policy "items_select_own"
  on public.items for select
  using (auth.uid() = owner_id);

create policy "items_insert_own"
  on public.items for insert
  with check (auth.uid() = owner_id);

create policy "items_update_own"
  on public.items for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "items_delete_own"
  on public.items for delete
  using (auth.uid() = owner_id);

-- Note: the service_role key bypasses these policies. Use it server-side only,
-- never with unvalidated user input. (VG-008)
