create table if not exists public.chat_transcripts (
  id           uuid        primary key default gen_random_uuid(),
  created_at   timestamptz not null    default now(),
  session_id   text        not null    check (char_length(session_id) between 1 and 100),
  transcript   jsonb       not null,
  interest_tag text,
  status       text        not null    default 'new'
);
alter table public.chat_transcripts enable row level security;
drop policy if exists "Anyone can save a chat transcript" on public.chat_transcripts;
create policy "Anyone can save a chat transcript"
  on public.chat_transcripts for insert to anon, authenticated with check (true);

-- Retention: ~1 month. A daily pg_cron job purges rows older than 30 days, so the
-- "kept for up to 1 month, then deleted" promise in /privacy is self-enforcing.
-- (The purge runs as an internal job and bypasses RLS, so no DELETE policy is needed.)
create extension if not exists pg_cron;
select cron.schedule(
  'voia-purge-chat-transcripts',
  '17 3 * * *',                              -- daily at 03:17 UTC
  $$ delete from public.chat_transcripts where created_at < now() - interval '30 days' $$
);
