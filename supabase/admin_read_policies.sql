-- Voia · admin read-only RLS policies for the /admin dashboard.
-- Run by the owner directly in the Supabase SQL editor (this codebase has no
-- dashboard access). Kept here for version control — same pattern as the
-- pg_cron purge recorded in supabase/chat_transcripts.sql. Must stay in sync
-- with the live DB: if you change these in the dashboard, update this file too.
--
-- Scope: SELECT only, restricted to the single admin user's UID, for
-- enquiries, chat_transcripts, AND contact_messages. The anon/publishable
-- key still has no read access to any of these tables (see
-- supabase/enquiries.sql, supabase/chat_transcripts.sql,
-- supabase/contact_messages.sql). No UPDATE/DELETE policy is added anywhere
-- — the dashboard stays read-only, and GDPR erasure remains a Supabase
-- dashboard action.
--
-- Replace <ADMIN_USER_UID> with the real admin user's auth.users id before
-- running (do not invent one). The contact_messages policy additionally
-- requires supabase/contact_messages.sql to have been run first (that table
-- does not exist yet — see the "NOT yet run" note in that file).

create policy "Admin can read enquiries"
  on public.enquiries for select to authenticated
  using ( (select auth.uid()) = '<ADMIN_USER_UID>'::uuid );

create policy "Admin can read chat transcripts"
  on public.chat_transcripts for select to authenticated
  using ( (select auth.uid()) = '<ADMIN_USER_UID>'::uuid );

create policy "Admin can read contact messages"
  on public.contact_messages for select to authenticated
  using ( (select auth.uid()) = '<ADMIN_USER_UID>'::uuid );
