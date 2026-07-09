# Design rationale

A short explanation of the decisions behind how Voia is built, and why.

## Discovery → booking, not affiliate links

Voia is a discovery → booking platform (`00_brief.md`): visitors start from a
feeling — a vibe card or a plain-language description of a dream trip — rather
than a destination they already know, and get matched to places in the
catalog. From there, booking happens in-house: a package or destination page
leads to the `/contact` enquiry form, which saves the request to Supabase. We
deliberately didn't route this through affiliate links — the brief resolved
this as "both" a discovery tool and a booking agency, so the trip a visitor
finds is the trip they can ask about directly, with no third-party hand-off
in between.

## Static-first, with exactly one AI endpoint

The catalog — destinations, packages, vibes — changes rarely and is curated by
us, so it's baked in at build time as Astro content collections rather than
fetched at runtime. That keeps every page prerendered static HTML, which is
fast and SEO-friendly by default. The one exception is `/api/chat`: the AI
concierge needs to call out to Google Gemini per request, so it's the single
on-demand route in the site, added via the `@astrojs/netlify` adapter while
`output` stays at its static default. Everything else on the site never
touches a server at request time.

## Supabase RLS: insert-only for visitors, UID-scoped reads for the admin

Both the `enquiries` and `chat_transcripts` tables have Row Level Security
turned on, with exactly one INSERT policy for the `anon`/`authenticated`
roles and `with check (true)`. That means the publishable key — which is
baked into the client bundle and visible in page source, as any static site's
key is — can create rows but can never read, list, update, or delete them.
The `/admin` dashboard reads both tables through a separate SELECT policy
scoped to the single admin user's UID, so admin access rides on Supabase Auth
rather than a second, more powerful key. There is no UPDATE or DELETE policy
on either table for any role, so erasure stays a deliberate, manual action.

## The Gemini key never leaves the server

`GEMINI_API_KEY` has no `PUBLIC_` prefix, so Astro never bundles it into
client code. It's read only inside `src/pages/api/chat.ts`, via
`import.meta.env.GEMINI_API_KEY`. The browser only ever calls
`fetch('/api/chat')`; the request to Google's Gemini API happens entirely
server-side, so the key is never exposed in the page source, the network
tab, or the built `dist/` output.

## Anonymous chat capture, ~1-month retention

Every `/api/chat` conversation is saved to `chat_transcripts` for
lead-capture and product-learning purposes, keyed to a random session id
generated in memory on the client (`crypto.randomUUID()`, not persisted to
`localStorage`) — there's no name, email, IP address, user-agent, or other
identifying detail stored alongside it. A daily `pg_cron` job deletes rows
older than 30 days, so the "kept for about a month" promise in `/privacy` is
enforced by the database itself rather than relying on someone to remember to
clean up manually.
