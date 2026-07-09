-- Voia · enquiries retention purge (~1 month).
-- Run by the owner directly in the Supabase SQL editor (this codebase has no
-- dashboard access). Must be run ONCE for the pg_cron job to actually take
-- effect against the live DB — same pattern as the chat-transcripts purge
-- recorded in supabase/chat_transcripts.sql and the admin read policies in
-- supabase/admin_read_policies.sql.
--
-- Retention: ~1 month. A daily pg_cron job purges enquiries rows older than
-- 30 days, so the "kept for about a month" promise in /privacy is
-- self-enforcing. (The purge runs as an internal job and bypasses RLS, so no
-- DELETE policy is needed.)

create extension if not exists pg_cron;
select cron.schedule(
  'voia-purge-enquiries',
  '11 3 * * *',                              -- daily at 03:11 UTC
  $$ delete from public.enquiries where created_at < now() - interval '30 days' $$
);
