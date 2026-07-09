-- Voia · enquiries schema as live in Supabase (insert-only for the public key).
-- Already applied via the Supabase SQL editor; kept here for version control.
create table if not exists public.enquiries (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null,
  email         text not null,
  trip_slug     text,
  trip_title    text,
  travel_from   date,
  travel_to     date,
  adults        smallint not null default 1,
  children      smallint not null default 0,
  pets          smallint not null default 0,
  message       text,
  consent       boolean not null default false,
  consent_text  text,
  status        text not null default 'new'
);
alter table public.enquiries
  add constraint enquiries_email_check   check (position('@' in email) > 1),
  add constraint enquiries_consent_check check (consent = true),
  add constraint enquiries_counts_check  check (adults >= 0 and children >= 0 and pets >= 0);
alter table public.enquiries enable row level security;
create policy "Anyone can submit an enquiry"
  on public.enquiries for insert
  to anon, authenticated
  with check (true);
