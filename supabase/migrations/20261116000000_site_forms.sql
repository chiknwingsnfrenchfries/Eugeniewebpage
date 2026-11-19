-- Already applied by hand in the SQL editor on 2026-11-16. Recorded here so the
-- repo documents the table. Safe to re-run (IF NOT EXISTS everywhere).

alter table public.leads
  add column if not exists source text,
  add column if not exists role text,
  add column if not exists message text,
  add column if not exists property_address text,
  add column if not exists gclid text,
  add column if not exists gbraid text,
  add column if not exists wbraid text;

create table if not exists public.newsletter (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  email text not null,
  source text,
  lang text
);
alter table public.newsletter enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'newsletter' and policyname = 'allow_public_insert') then
    create policy allow_public_insert on public.newsletter for insert to public with check (true);
  end if;
end $$;
grant insert on public.newsletter to anon, authenticated;

notify pgrst, 'reload schema';
