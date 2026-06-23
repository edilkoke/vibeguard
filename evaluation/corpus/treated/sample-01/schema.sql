-- DEMO FIXTURE — secure equivalent. RLS on + owner-only policy.
create table items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  title text not null
);

alter table items enable row level security;

create policy "items_own" on items
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
