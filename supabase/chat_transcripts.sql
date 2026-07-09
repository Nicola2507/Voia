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
