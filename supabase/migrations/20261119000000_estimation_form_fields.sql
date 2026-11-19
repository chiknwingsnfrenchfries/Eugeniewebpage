-- Fields for the home valuation forms (ads landing page + resources page).
-- Run in Supabase → SQL Editor BEFORE deploying the site changes that send them.
-- (The site falls back to the old field set if these columns are missing,
--  so no lead is lost, but the new values would not be saved.)

alter table public.leads
  add column if not exists property_unit text,  -- "App." field
  add column if not exists fbclid text,         -- Meta ads click ID
  add column if not exists landing_page text,   -- first page of the visit (path)
  add column if not exists form_id text;        -- 'estimation-ads' | 'estimation-ressources'

-- The existing insert-only policy (allow_public_insert) covers new columns.

notify pgrst, 'reload schema';
