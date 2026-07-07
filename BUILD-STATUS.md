# BUILD-STATUS — what currently exists in the real code (VS Code)

> **Why this file exists:** the Project (claude.ai) cannot see the actual code on my computer. This file is the bridge in that direction — it tells any chat in this Project what has really been built in VS Code so far, so no chat assumes something is missing (or already done) when it isn't.
>
> **Keep it current:** after each building session in VS Code, update the snapshot + log below (or let Claude Code update it — see the prompt at the bottom), then **re-upload this file to the Project knowledge** so chats stay in sync.
>
> *(This file replaces the separate "changelog" — one place for "state of the real code" is simpler.)*

## Current state (snapshot)
- **Phase:** Planning ☐ · Building ☑ · Polishing ☐
- **Stack:** Astro 6 + Tailwind v4 (`@tailwindcss/vite`) + Supabase (not wired yet), deploy on Netlify *(decided)*
- **Live preview URL:** https://celebrated-gumption-a7231a.netlify.app
- **GitHub repo:** https://github.com/Nicola2507/Voia
- **Last updated:** 7 July 2026

## Build milestones — tick what's actually done in VS Code
- [x] Project scaffolded (Astro + Tailwind v4), git initialized, first commit
- [x] Deployed a preview (GitHub → Netlify) with a placeholder homepage on a live URL
- [x] Homepage / vacation type selector built *(real homepage: header, hero, AI search box (visual-only), 8 vibe cards, footer)*
- [ ] Destinations pages (list + detail)
- [ ] Tour packages pages (if applicable)
- [ ] About + Contact pages
- [ ] Supabase project + schema + RLS
- [ ] Inquiry form → saves to Supabase + email
- [ ] Admin dashboard (Supabase Auth)
- [ ] AI chatbot (secure endpoint + widget + lead capture)
- [ ] Accessibility pass (WCAG AA)
- [ ] SEO + structured data
- [ ] Performance / images (Lighthouse 90+)
- [ ] Docs (README + design rationale)
- [ ] Final production deploy

## Build log (newest first — one line per session)
- 7 July 2026 — **Real homepage built (vacation-type selector).** Replaced the placeholder with the actual Voia homepage: minimal header (wordmark), hero ("Travel the way you feel." + intro line), the AI custom-search box per the design spec (gradient hairline border, Sparkles icon, example-prompt chips, visual-only — submitting shows a "coming soon" note, no backend/API), and the 8 vibe-category cards (no-photo fallback variant, rotating coral/teal/amber/sand tints, linking to `/vibe/{slug}` — those pages don't exist yet) with inline Lucide SVG icons. Accessibility pass done (one h1, visible focus rings, 44px/40px tap targets, `prefers-reduced-motion` respected, decorative icons hidden from screen readers). Checked at mobile (375px) and desktop (1280px) with a headless browser — no console errors, no horizontal overflow.
- 1 July 2026 — **Project foundation set up and shipped live.** Scaffolded Astro 6 + Tailwind v4, pasted the design-system `@theme` tokens into `src/styles/global.css`, added `BaseLayout.astro` (Bricolage Grotesque + Plus Jakarta Sans, warm-paper background, ink text), built a minimal placeholder homepage, added `CLAUDE.md` + `netlify.toml`. Removed an accidental duplicate Astro project folder that was shadowing the real one. Pushed to GitHub and connected Netlify for auto-deploy — Voia homepage confirmed live at the URL above.

## Decisions made while building
- **Astro 6 / Node 22.12+** — `npm create astro@latest` now scaffolds Astro 6, which requires Node ≥ 22.12.0 (building on Node 24 locally, which is fine). Pinned `NODE_VERSION = "22"` in `netlify.toml` so the Netlify build uses a compatible Node and doesn't fail.
- **No Netlify adapter (yet)** — the site is static-first, and static Astro deploys to Netlify with no adapter. We'll add `@astrojs/netlify` later only when we introduce the server endpoints for AI / Supabase.
- **Tailwind v4 via `@tailwindcss/vite`** — confirmed current; theme lives in a CSS `@theme` block, not `tailwind.config.js`. *(Already captured in `02_design-system.md`.)*
- **Windows / PowerShell note** — commit commands are run as two separate lines (`git add -A` then `git commit -m "…"`), since PowerShell doesn't accept `&&` to chain them.
