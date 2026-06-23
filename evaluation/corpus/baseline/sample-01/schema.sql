-- DEMO FIXTURE — intentionally vulnerable. RLS never enabled. (VG-002)
create table items (
  id serial primary key,
  owner_id uuid,
  title text
);
-- RLS is never turned on; anyone with the public anon key can read every row.
