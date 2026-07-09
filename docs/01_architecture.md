# 01 — Architecture
*How Voia is built: the stack, where data lives, the Supabase backend, security, and the request flows. The source of truth for technical decisions. Keep current as the system grows.*

> **How to use this file:** pair it with `00_project-overview` (vision + rules), `02_design-system` (UI), `03_content` (catalog), and `BUILD-STATUS` (what's actually live in the code). When an architectural decision changes, update it here **and** log it in `BUILD-STATUS`. Drop a copy in the repo at `docs/01_architecture.md` so Claude Code can read it while building.

---

## 1 · The shape of the system (one line)
A **static-first Astro** site (the catalog is baked in at build time) plus a **Supabase Postgres** backend for the dynamic bits (enquiries; chatbot leads later), deployed **GitHub → Netlify**, plus one **on-demand server endpoint** (`/api/chat`, via the `@astrojs/netlify` adapter) that runs the AI chatbot with its secret key kept server-side.

---

## 2 · Stack (current, verified)

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Astro 7** (`^7.0.3`) | **Default static output** (`output` unset), with the `@astrojs/netlify` adapter added for one on-demand route. (Upgraded from the Astro 6 scaffold during the enquiry build — see `BUILD-STATUS`.) |
| Styling | **Tailwind v4** via `@tailwindcss/vite` | Theme lives in a CSS `@theme` block (`02_design-system` §8), not `tailwind.config.js`. |
| Catalog data | **Astro content collections** | 8 destinations + 6 packages as `.md`; schema in `src/content.config.ts` (`03_content`). |
| Backend / dynamic data | **Supabase** (Postgres + RLS) | Via `@supabase/supabase-js` (`^2.110.x`). |
| AI chatbot | **Google Gemini** (`gemini-2.5-flash`, free tier) via **`@google/genai`** | Server-only, in `src/pages/api/chat.ts` (`export const prerender = false`). See §4a. |
| On-demand adapter | **`@astrojs/netlify`** | Default output stays static; only `/api/chat` opts into an on-demand Netlify function. |
| Runtime | **Node ≥ 22.12** | `package.json` `engines`; Netlify pins `NODE_VERSION = "22"` in `netlify.toml`. |
| Hosting / CI | **GitHub → Netlify** | Repo `Nicola2507/Voia`; auto-deploys on push to `main`. |
| Live preview | https://celebrated-gumption-a7231a.netlify.app | |

---

## 3 · Where data lives (and why)
- **Static, in-repo (content collections):** the curated catalog — destinations, packages, vibes — because it changes rarely and benefits from build-time speed + SEO. Source of truth: `03_content`.
- **Dynamic, in Supabase:** anything visitor-generated or changing at runtime. Today that's the **`enquiries`** table and the **`chat_transcripts`** table. Later: admin data, the social feature.

**Rule of thumb:** if a visitor creates it, or it changes without a redeploy → **Supabase**. If it's our curated content → **content collection**.

---

## 4 · Supabase backend
Project on the Supabase **Free tier**. *(Heads-up: free projects pause after ~7 days of inactivity; data returns on resume.)* Project URL: `https://bmkkdiaqnwxosisohdja.supabase.co`. Region: an **EU region** (recommended for GDPR data residency — confirm the exact one in Project Settings).

### 4.1 · `enquiries` table
The first "booking" step: the Contact/Enquiry form (`/contact`) writes here. **Anonymous-by-default** — we store only what the visitor types plus a consent record; **no IP address, no user-agent, no cookies.**

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (pk) | `gen_random_uuid()` |
| `created_at` | timestamptz | `now()` |
| `name` | text (required) | who to reply to |
| `email` | text (required) | who to reply to |
| `trip_slug` / `trip_title` | text | pre-filled from a trip/destination CTA; optional |
| `travel_from` / `travel_to` | date | optional |
| `adults` / `children` / `pets` | smallint | defaults 1 / 0 / 0 |
| `message` | text | optional, short |
| `consent` | boolean | must be `true` (DB-enforced) |
| `consent_text` | text | exact wording the visitor agreed to |
| `status` | text | admin workflow; default `'new'` |

Schema is version-controlled in the repo at **`supabase/enquiries.sql`**. DB-level guards: email must contain `@`, `consent` must be `true`, and the counts must be ≥ 0.

### 4.2 · Row Level Security (the privacy guard)
RLS is **ON**, with exactly **one** policy:

> **"Anyone can submit an enquiry"** — `INSERT`, roles `anon` + `authenticated`, `with check (true)`.

There is deliberately **no** `SELECT` / `UPDATE` / `DELETE` policy for `anon`/`authenticated` at large, so the public key can **create** an enquiry but can never **read, list, edit, or delete** them.

**Admin read access:** both `enquiries` and `chat_transcripts` (§4.3) additionally carry one `SELECT` policy each, scoped to the single admin user's UID (`(select auth.uid()) = '<ADMIN_USER_UID>'::uuid`, role `authenticated`) — versioned at `supabase/admin_read_policies.sql` and consumed by the `/admin` dashboard (§8). The anon/publishable key still has **no** read access to either table; there is still **no** `UPDATE`/`DELETE` policy on either table, from any role — the dashboard is read-only and GDPR erasure stays a Supabase dashboard action.

- **Admin reads (now):** the `/admin` dashboard (§8), via a `SELECT` policy scoped to the admin — see §4.2. (The Supabase dashboard **Table Editor** also still works, as a service-role/owner-login path, independent of the app.)
- **State:** insert verified working (`POST` → `201`); with no anon `SELECT` policy, the public key's `SELECT` returns nothing. *(An earlier misconfig briefly allowed public reads; fixed 9 Jul — see `BUILD-STATUS`.)*

### 4.3 · `chat_transcripts` table
Anonymous lead capture for the chat widget (§4a). Every `/api/chat` request saves the conversation server-side — **no personal data, no IP address, no user-agent.**

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (pk) | `gen_random_uuid()` |
| `created_at` | timestamptz | `now()` |
| `session_id` | text (required) | a random id (`crypto.randomUUID()`) generated **in memory** per chat session on the client — not persisted (no `localStorage`), not tied to a visitor identity |
| `transcript` | jsonb (required) | the full conversation as `[{ role, text }, ...]`, written once per request (incoming messages + the assistant's reply) |
| `interest_tag` | text | reserved for future use; always `null` today |
| `status` | text | admin workflow; default `'new'` |

Schema is version-controlled in the repo at **`supabase/chat_transcripts.sql`**. Same RLS shape as `enquiries` (§4.2): **insert-only** for `anon` + `authenticated`, no anon `SELECT`/`UPDATE`/`DELETE` policy, written with the **publishable key** — never `service_role`. The insert happens server-side in `src/pages/api/chat.ts`, awaited before the response is sent, wrapped in try/catch so a save failure is logged but never changes or blocks the reply. **Retention: ~1 month** — a daily `pg_cron` job (`voia-purge-chat-transcripts`) deletes rows older than 30 days, so the promise is self-enforcing (§7). The purge is included in `supabase/chat_transcripts.sql`. **Admin reads (now):** the `/admin` dashboard (§8), via the admin-UID-scoped `SELECT` policy described in §4.2.

---

## 4a · AI chatbot concierge (`/api/chat`)
The Voia guide — a chat widget on every page (`02_design-system` §7.5), backed by **Google Gemini** via the unified **`@google/genai`** SDK, model **`gemini-2.5-flash`** (free tier).

- **The only on-demand route on the site.** Everything else stays prerendered static HTML; `src/pages/api/chat.ts` sets `export const prerender = false` so Astro (via the `@astrojs/netlify` adapter) emits it as a single Netlify function, with `output` left at its static default.
- **Key stays server-side.** `GEMINI_API_KEY` (no `PUBLIC_` prefix) is read only inside the endpoint via `import.meta.env.GEMINI_API_KEY` (falling back to `process.env`), and is never sent to the browser — the client only ever calls `fetch('/api/chat')`.
- **Grounded at request time, not hardcoded.** The system prompt is rebuilt on every request from `getCollection('destinations')` + `getCollection('packages')`, so the bot always reflects the live catalog — one source of truth, per §3.
- **Guardrails:** warm Voia voice; only discusses this catalog and closely-related general travel help (off-topic → a brief note pointing to `/contact`); package prices are always framed as indicative placeholders, never stated as final; no invented hotels/hours/itinerary detail; plain-text replies only (the widget renders chat bubbles, not markdown).
- **Input handling:** validates the `{ messages: [{role, text}] }` payload shape, caps message length (1000 chars) and history length (20 messages); on any failure (bad input, missing key, Gemini error) it logs server-side and returns a generic `500` — never leaks the key or raw provider errors to the client.
- **GDPR / no PII:** the bot does not ask for or store personal details. An **anonymous transcript** of each conversation (messages only, keyed to a random in-memory session id — see §4.3) is saved to Supabase for lead-capture/product-learning purposes; no name, email, IP address, user-agent, or other identifying detail is ever stored with it, and a save failure never affects the reply. Booking or anything specific to the visitor is routed to the `/contact` enquiry form instead. `/privacy` discloses both the Gemini hand-off and the anonymous transcript save.

---

## 5 · Keys, env vars & the security model
**Two kinds of Supabase key:**
- **Publishable key** (`sb_publishable_…`; older name "anon key") — **safe in the browser.** All it can do is what RLS allows (here: insert an enquiry). This is the **only** Supabase key the site uses.
- **Secret / `service_role` key** — all-powerful; **must never touch the browser or the repo.** Not used.

**`GEMINI_API_KEY`** (Google Gemini, for `/api/chat`) — **server-only, no `PUBLIC_` prefix**, so Astro never bundles it into client code. Read via `import.meta.env.GEMINI_API_KEY` inside the endpoint only.

**Env vars** (Astro exposes only `PUBLIC_`-prefixed vars to browser code):

| Variable | Holds | Where it's set |
|---|---|---|
| `PUBLIC_SUPABASE_URL` | Project URL | `.env` (local) + Netlify env vars |
| `PUBLIC_SUPABASE_ANON_KEY` | the **publishable** key | `.env` (local) + Netlify env vars |
| `GEMINI_API_KEY` | Google Gemini API key (**server-only**) | `.env` (local) + Netlify env vars (secret) |

`.env` is **gitignored**; a committed **`.env.example`** holds empty placeholders as a template.

> **Honest note:** because the site is static, the publishable key is **baked into the client bundle** at build time and is visible in page source. That's expected and safe — **RLS is the real guard**, and the key alone can only insert. The key that must never be exposed (`service_role`) isn't used here.

---

## 6 · How an enquiry flows
```
visitor
  └─ /contact  (or a trip page's "Enquire about this trip" CTA,
                which deep-links: /contact?trip=<slug>&title=<Title>)
       └─ fills form  (name, email, consent required; dates/party/message optional)
            └─ client-side  supabase.from('enquiries').insert({...})   ← publishable key
                 └─ RLS allows the INSERT   (no .select() chained — there's no read policy)
                      └─ row saved  →  friendly confirmation on screen
                           └─ admin reads it in the Supabase dashboard
```
The browser client is built once in **`src/lib/supabase.ts`** from the `PUBLIC_` env vars. A hidden **honeypot** field silently drops bot submissions (no cookies, no CAPTCHA).

---

## 7 · GDPR / privacy posture
- **Lawful basis: consent** — an explicit, unticked-by-default checkbox; we store the exact wording agreed **+** timestamp.
- **Data minimisation** — only fields needed to reply; dates/party size optional; no phone, no marketing bundled in.
- **Anonymous-by-default** — no analytics/cookies on the form; no IP/user-agent stored.
- **Transparency & rights** — a `/privacy` notice explains what/why/who-sees-it; erasure is a single row delete in the dashboard.
- **Chatbot (`/api/chat`):** chat input is sent to Google's Gemini API to generate a reply. The bot doesn't ask for or store personal details, but an **anonymous transcript** of the conversation (messages plus a random session id — no PII, no IP address) is saved to Supabase's `chat_transcripts` table (§4.3) so we can learn what people ask; lawful basis is **legitimate interest**. Retention is **~1 month**, enforced by a daily `pg_cron` purge of rows older than 30 days. `/privacy` discloses both the Gemini hand-off and the anonymous transcript save; booking or anything visitor-specific is routed to `/contact` instead of being collected in chat.

---

## 8 · Deferred / roadmap
- **Email notification** on a new enquiry.
- **Chatbot:** further work — optional **pgvector** for "similar destination" search; streaming responses; multi-language. (Anonymous transcript capture is **done** — see §4.3, §4a, and `BUILD-STATUS`.)
- **Social feature** — a later module.

**Done:** **Admin dashboard** — a private, client-gated, static `/admin` page (Supabase Auth email+password login) reads the 50 most recent `enquiries` and `chat_transcripts` rows, via a `SELECT` policy scoped to the single admin's UID on each table (§4.2). Read-only — no edit/delete/update controls or policies. See `BUILD-STATUS` for the build log.

These each need either the **secret key kept server-side** (have it, via `/api/chat`) or new Supabase writes/policies.

---

## 9 · Deploy pipeline
Push to `main` on GitHub → Netlify builds (`npm run build`, publish dir `dist`, `NODE_VERSION = "22"` via `netlify.toml`) → live. The `@astrojs/netlify` adapter is installed, but `output` is left at its **static** default — the build still emits prerendered HTML for every page, plus a single on-demand Netlify function for `/api/chat` (see §4a). Supabase and Gemini env vars are set in **both** `.env` (local) and the **Netlify dashboard** (production) — `GEMINI_API_KEY` as a secret, no `PUBLIC_` prefix.

---

## 10 · Open gaps / TODOs (kept honest)
- **`/privacy`:** real contact email + the enquiries retention period are still placeholders. *(Chat-transcript retention is now set — ~1 month, auto-purged via `pg_cron` — see §4.3/§7.)*
- **Email notifications** — deferred (§8). *(Admin dashboard is now done — see §8.)*
- **Spam:** only a honeypot today; an insert-only public form can still be spammed — consider rate-limiting or moving inserts behind a server function if it becomes a problem.
- **Currency:** EUR vs RON display is still open (`03_content` §8).
- **Prices/itineraries** remain illustrative placeholders (`03_content`).

---

## Cross-references
`00_brief` (brand) · `00_project-overview` (vision + rules) · `02_design-system` (UI) · `03_content` (catalog) · `BUILD-STATUS` (live state) · `supabase/enquiries.sql`, `supabase/chat_transcripts.sql` (schemas).

## ✅ Knowledge file to update
- **Save as `01_architecture.md`** in the Project knowledge, and drop a copy in the repo at **`docs/01_architecture.md`** (commit it). Update whenever an architectural decision changes, and log the change in `BUILD-STATUS`.
