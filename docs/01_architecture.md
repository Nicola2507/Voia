# 01 — Architecture
*How Voia is built: the stack, where data lives, the Supabase backend, security, and the request flows. The source of truth for technical decisions. Keep current as the system grows.*

> **How to use this file:** pair it with `00_project-overview` (vision + rules), `02_design-system` (UI), `03_content` (catalog), and `BUILD-STATUS` (what's actually live in the code). When an architectural decision changes, update it here **and** log it in `BUILD-STATUS`. Drop a copy in the repo at `docs/01_architecture.md` so Claude Code can read it while building.

---

## 1 · The shape of the system (one line)
A **static-first Astro** site (the catalog is baked in at build time) plus a **Supabase Postgres** backend for the dynamic bits (enquiries now; chatbot leads and more later), deployed **GitHub → Netlify**. AI features will run through a **server endpoint with the secret key kept server-side** — not built yet.

---

## 2 · Stack (current, verified)

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Astro 7** (`^7.0.3`) | Static output, **no SSR adapter yet**. (Upgraded from the Astro 6 scaffold during the enquiry build — see `BUILD-STATUS`.) |
| Styling | **Tailwind v4** via `@tailwindcss/vite` | Theme lives in a CSS `@theme` block (`02_design-system` §8), not `tailwind.config.js`. |
| Catalog data | **Astro content collections** | 8 destinations + 6 packages as `.md`; schema in `src/content.config.ts` (`03_content`). |
| Backend / dynamic data | **Supabase** (Postgres + RLS) | Via `@supabase/supabase-js` (`^2.110.x`). |
| Runtime | **Node ≥ 22.12** | `package.json` `engines`; Netlify pins `NODE_VERSION = "22"` in `netlify.toml`. |
| Hosting / CI | **GitHub → Netlify** | Repo `Nicola2507/Voia`; auto-deploys on push to `main`. |
| Live preview | https://celebrated-gumption-a7231a.netlify.app | |

---

## 3 · Where data lives (and why)
- **Static, in-repo (content collections):** the curated catalog — destinations, packages, vibes — because it changes rarely and benefits from build-time speed + SEO. Source of truth: `03_content`.
- **Dynamic, in Supabase:** anything visitor-generated or changing at runtime. Today that's the **`enquiries`** table. Later: chatbot leads/transcripts, admin data, the social feature.

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

There is deliberately **no** `SELECT` / `UPDATE` / `DELETE` policy, so the public key can **create** an enquiry but can never **read, list, edit, or delete** them.

- **Admin reads (now):** in the Supabase dashboard (**Table Editor**), which runs as the service role and bypasses RLS — so only someone logged into the project sees enquiries.
- **Admin reads (later):** the admin dashboard (§8) will add a `SELECT` policy scoped to the authenticated admin user.
- **State:** insert verified working (`POST` → `201`); with no read policy, the public key's `SELECT` returns nothing. *(An earlier misconfig briefly allowed public reads; fixed 9 Jul — see `BUILD-STATUS`.)*

---

## 5 · Keys, env vars & the security model
**Two kinds of Supabase key:**
- **Publishable key** (`sb_publishable_…`; older name "anon key") — **safe in the browser.** All it can do is what RLS allows (here: insert an enquiry). This is the **only** key the site uses.
- **Secret / `service_role` key** — all-powerful; **must never touch the browser or the repo.** Not used yet; reserved for future server-side features.

**Env vars** (Astro exposes only `PUBLIC_`-prefixed vars to browser code):

| Variable | Holds | Where it's set |
|---|---|---|
| `PUBLIC_SUPABASE_URL` | Project URL | `.env` (local) + Netlify env vars |
| `PUBLIC_SUPABASE_ANON_KEY` | the **publishable** key | `.env` (local) + Netlify env vars |

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

---

## 8 · Deferred / roadmap (needs the server side)
These each need a **server endpoint** (add `@astrojs/netlify`, moving from static to hybrid) and/or the **secret key kept server-side**:
- **Email notification** on a new enquiry.
- **Admin dashboard** — Supabase Auth login + a `SELECT` policy scoped to the admin, to read enquiries in-app.
- **AI chatbot concierge** — grounded in the catalog, secret API key server-side, captures leads to Supabase; optional **pgvector** for "similar destination" search.
- **Social feature** — a later module.

Until then the site stays **static, no adapter**.

---

## 9 · Deploy pipeline
Push to `main` on GitHub → Netlify builds (`npm run build`, publish dir `dist`, `NODE_VERSION = "22"` via `netlify.toml`) → live. No adapter (static). Supabase env vars are set in **both** `.env` (local) and the **Netlify dashboard** (production).

---

## 10 · Open gaps / TODOs (kept honest)
- **`/privacy`:** real contact email + a retention period (placeholders today).
- **Email notifications + admin dashboard** — deferred (§8).
- **Spam:** only a honeypot today; an insert-only public form can still be spammed — consider rate-limiting or moving inserts behind a server function if it becomes a problem.
- **Currency:** EUR vs RON display is still open (`03_content` §8).
- **Prices/itineraries** remain illustrative placeholders (`03_content`).

---

## Cross-references
`00_brief` (brand) · `00_project-overview` (vision + rules) · `02_design-system` (UI) · `03_content` (catalog) · `BUILD-STATUS` (live state) · `supabase/enquiries.sql` (schema).

## ✅ Knowledge file to update
- **Save as `01_architecture.md`** in the Project knowledge, and drop a copy in the repo at **`docs/01_architecture.md`** (commit it). Update whenever an architectural decision changes, and log the change in `BUILD-STATUS`.
