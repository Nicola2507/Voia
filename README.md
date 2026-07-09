# Voia

Voia is a travel discovery → booking site. Visitors either pick a vibe — Beach,
Mountain, City Break, Historical Monuments, Tourist Attractions, Nature &
Landscapes, Adventure, or Relaxation & Wellness — or describe a dream trip in
plain words ("somewhere warm in winter", "places like Santorini"), and get
matched to destinations. Romania is the local hero, paired with well-known
international destinations, and each place can lead to a curated, bookable
trip via an in-house enquiry.

See [`docs/DESIGN-RATIONALE.md`](docs/DESIGN-RATIONALE.md) for why the site is
built the way it is.

## Stack

- **[Astro 7](https://docs.astro.build)** — static output by default
- **Tailwind v4** via `@tailwindcss/vite`
- **Supabase** (Postgres + Row Level Security) for enquiries and chat transcripts
- **`@astrojs/netlify`** adapter — the site stays static; only `/api/chat` is an on-demand route
- **Google Gemini** (`gemini-2.5-flash`) via `@google/genai`, called server-side only
- **Node ≥ 22.12**

## Run locally

```bash
npm install
npm run dev
```

Build and preview the production output:

```bash
npm run build
npm run preview
```

## Environment variables

Copy `.env.example` to `.env` and fill in real values (`.env` is gitignored,
never committed):

```bash
cp .env.example .env
```

| Variable | Holds | Notes |
|---|---|---|
| `PUBLIC_SUPABASE_URL` | Supabase project URL | Safe in the browser |
| `PUBLIC_SUPABASE_ANON_KEY` | Supabase **publishable** key | Safe in the browser — RLS limits it to inserting enquiries/transcripts, nothing else |
| `GEMINI_API_KEY` | Google Gemini API key | **Server-only** — never prefixed with `PUBLIC_`, never sent to the browser |

## Deploy

Push to `main` and Netlify builds automatically (`npm run build`, publish
directory `dist`, `NODE_VERSION = 22` via `netlify.toml`). The same three env
vars are set in the Netlify dashboard, with `GEMINI_API_KEY` stored as a
secret.
