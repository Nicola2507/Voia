# 00 — Project Overview (read me first)
*Always-on context for every chat in this Project. Keep this file current as decisions change.*

## What we're building
A **travel website** (university project) that helps visitors quickly find destinations based on the **type of vacation** they want. The core experience: pick a vibe — Beach, Mountain, City Break, Historical Monuments, Tourist Attractions, Nature & Landscapes, Adventure, Relaxation & Wellness — **or** describe a dream trip in plain words ("somewhere warm in winter", "places like Santorini") and get matched to destinations.

## Status
**Shipped** (live in production).

## Goals
- Help users find destinations fast, in an extremely simple, inspiring, **mobile-first** experience.
- Demonstrate real skills for the course: a **backend (Supabase)**, an **AI chatbot**, plus accessibility, SEO, and performance.

## Scope & key features
- **Homepage / Vacation Type Selector** — already specified (see `homepage-vacation-selector-spec.md`): 8 category cards + a prominent AI **Custom Search**.
- **Destinations** (and optionally tour **packages**) as content.
- **Inquiry/booking form** → saved to Supabase + emailed.
- **AI Chatbot concierge** — grounded in our catalog, captures leads into Supabase, API key kept **server-side**.
- **Admin dashboard** — view inquiries & leads (Supabase Auth + RLS).
- **Future module (a separate chat later):** a social feature.

## Open decision (resolve in the brief)
Is this primarily a **discovery / recommendation** platform (recommends destinations, possibly affiliate-based) or a **booking agency** (sells specific tour packages) — or **both**? This affects the data model and monetization, so we decide it in the first chat.

## Tech stack & architecture (decided)
- **Astro + Tailwind**, mobile-first, **static-first** for speed and SEO (only interactive bits use JavaScript).
- **Supabase** for dynamic data (inquiries, chatbot leads, transcripts; later the social feature). The tour catalog lives in **Astro content collections**.
- **AI features** run through a **server endpoint with the API key kept server-side** — never in the browser. Optional pgvector for "similar destination" search.
- **Deploy:** GitHub → **Netlify** (auto-deploys on every push).
- **Security/privacy:** Supabase **Row Level Security** (anyone can insert an inquiry; only the admin can read). EU/GDPR: anonymous-by-default tracking, consent, data minimization.

## How this Project is organized
- **This Project = the whole website. One project, many chats.**
- **Knowledge base files** (the source of truth — keep current): `00_project-overview` (this file), `00_brief`, `01_architecture`, `02_design-system`, `03_content`, `04_tech-decisions`, `homepage-vacation-selector-spec`, `07_changelog`.
- **One task per chat** — e.g. "Brand & Brief", "Homepage build", "Destinations", "Chatbot", "Social feature".
- The **actual coding** happens in **VS Code with Claude Code**, guided by a `CLAUDE.md` file built from these knowledge docs.

## Working style
The owner is **non-technical**: explain choices in plain language, give copy-paste-ready steps, work **one task per chat**, **commit after each working step**, never expose secrets, and ask before anything destructive or any spending.
