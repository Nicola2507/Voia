-- Voia · contact_messages schema — general contact form (/contact).
-- NOT yet run — run once in the Supabase SQL editor (this codebase has no
-- dashboard access). Until this is run, /contact falls back to a mailto:
-- link on insert failure, so the form still works end to end either way.
-- Mirrors the shape of supabase/enquiries.sql.
create table if not exists public.contact_messages (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null,
  email         text not null,
  subject       text not null,
  message       text not null,
  consent       boolean not null default false,
  consent_text  text,
  status        text not null default 'new'
);
alter table public.contact_messages
  add constraint contact_messages_email_check   check (position('@' in email) > 1),
  add constraint contact_messages_consent_check check (consent = true);
alter table public.contact_messages enable row level security;
create policy "Anyone can send a contact message"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

-- Retention: ~1 month, same policy as enquiries — see supabase/enquiries_purge.sql
-- for the pg_cron pattern to add once this table exists live.
