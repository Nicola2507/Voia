# Voia — Website Improvements (single Claude Code session)

Paste everything below this line into Claude Code, in the Voia repo. It is written to be run in ONE session. Some of it is already applied to the working tree (see "Already applied") — check current state and work idempotently; never duplicate a field or a file.

---

## Role & rules
You are my build collaborator on **Voia**, a university travel website. Stack: **Astro 7 + Tailwind v4** (CSS `@theme` in `src/styles/global.css`, no `tailwind.config.js`), **Supabase** (insert-only `enquiries` + `chat_transcripts`), **Netlify** adapter (static output + one on-demand route `src/pages/api/chat.ts`), Gemini via `@google/genai` (key server-side only). Node 22.

**Before writing code:** read the repo and `docs/00_project-overview.md`, `docs/00_brief.md`, `docs/01_architecture.md`, `docs/02_design-system.md`, `docs/03_content.md`, `BUILD-STATUS.md`. Treat them as source of truth.

**Hard rules (do not break):**
- Build everything from the design-system tokens (coral / teal / amber / sand scales, Bricolage Grotesque + Plus Jakarta Sans, `shadow-card`, `rounded-2xl`, WCAG AA pairings, 44px tap targets, visible `focus-visible` rings, `motion-reduce`). Match the existing component style exactly; reuse components; avoid duplicate code; refactor only where it clearly helps.
- **Never invent facts** (prices, hotels, hours). Prices stay `priceIsPlaceholder: true`.
- **No licensed photos exist and none can be fetched.** Do NOT hotlink or download external images. Build an original, license-clean **SVG poster-art** image system (details below).
- **Do NOT run live Supabase SQL** (no dashboard access here). Therefore: the `enquiries` insert must use only columns that already exist; any new table ships as a versioned `.sql` file marked "not yet run", and any form depending on it must degrade gracefully.
- Keep the site static-first; `/api/chat` stays the only on-demand route; the Gemini/`service_role` keys never reach the browser.
- **Commit incrementally by explicit path.** Do NOT `git add -A`: the working tree has unrelated uncommitted doc edits (`BUILD-STATUS.md`, `README.md`, `docs/00_project-overview.md`, `docs/01_architecture.md`, `src/pages/privacy.astro`) — leave those out of feature commits. Ask before anything destructive.
- Work through all sections, then run the Verification section. Don't stop for approvals unless you hit a true blocker.

## Already applied (verify, don't redo)
- `src/content.config.ts`: **destinations** gained `seasonMonths: number[]` (1–12, `.default([])`), `city: string?`, `activities: string[] .default([])`, `gallery: {src,alt}[] .default([])` (kept existing `heroImage`/`heroImageAlt`). **packages** gained `seasonMonths` and `activities` (both `.default([])`).
- All **8 destination** `.md` files: added `seasonMonths`, `city`, `activities`, `heroImage`, `heroImageAlt`, and a 3-item `gallery` — values in the table below.
- **Not yet done:** package frontmatter (`heroImage`/`heroImageAlt`/`seasonMonths`/`activities`); the SVG images themselves; smart search; filtering; Contact/Enquire split; footer dedupe; chatbot-prompt update; tests; build.

### Destination data reference (already in the 8 `.md` files — reuse for search/filters)
| slug | city | region | seasonMonths | activities |
|---|---|---|---|---|
| bali | Ubud | international | 4,5,6,7,8,9,10 | Beaches; Surfing; Yoga & wellness; Volcano hikes; Temples; Rice terraces |
| black-sea-coast | Constanța | romania | 6,7,8,9 | Beaches; Swimming; Seafront nightlife; History |
| brasov-carpathians | Brașov | romania | 1–12 | Old-town wandering; Hiking; Castle visits; Cable car |
| danube-delta | Tulcea | romania | 5,6,7,8,9,10 | Boat safaris; Birdwatching; Fishing villages; Sunrises |
| rome | Rome | international | 3,4,5,9,10,11 | Sightseeing; Museums; Food tours; Ancient history |
| santorini | Fira | international | 5,6,7,8,9,10 | Beaches; Sunsets; Wine tasting; Village wandering |
| sibiu-transfagarasan | Sibiu | romania | 5,6,7,8,9,10 | Old-town wandering; Scenic driving; Mountain hikes; Culture |
| swiss-alps-interlaken | Interlaken | international | 1,2,6,7,8,9,12 | Hiking; Paragliding; Scenic rail; Lakes |

Image files referenced by the frontmatter (you must generate them): `/images/destinations/<slug>.svg` (hero) + `<slug>-1.svg`, `-2.svg`, `-3.svg` (gallery).

---

## 1) Image system (SVG poster art)
Write a generator `scripts/generate-destination-art.mjs` (plain Node, no deps) that emits, into `public/images/destinations/`, per destination: a hero `<slug>.svg` and three gallery variants `<slug>-1/-2/-3.svg`. Also generate the 6 package heroes by reuse (see mapping) — no separate files needed.

- **viewBox 1600×1000**, `preserveAspectRatio="xMidYMid slice"` so `object-cover` crops cleanly on 4/5 cards; keep key motifs in the central band.
- Flat **travel-poster** style using the brand palette (coral `#EE5A35/#D2451F`, teal `#1E9A91/#137C74`, amber `#FAB31E`, sand `#F4EDE5`, ink `#2A201B`). Layered shapes only (sky gradient, sun/moon, hills/mountains/water silhouettes) + one or two scene motifs. Gallery variants = same scene at dawn / day / dusk palettes with small composition shifts. Keep each file a few KB.
- **Scene archetype per destination:** santorini = caldera cliff + white cubes + blue domes + sun over sea; bali = terraced hills + palms + volcano; swiss-alps-interlaken = snow peaks + turquoise lake + pines; rome = domed/arched skyline; sibiu-transfagarasan = rolling hills + winding hairpin road + town; brasov-carpathians = forested peaks + medieval towers; danube-delta = reed channels + water + a bird at low sun; black-sea-coast = sea + sand + sun + umbrella.
- Make them genuinely nice (this is the deliverable, not a placeholder): reusable motif functions, consistent horizon, subtle depth.

**Package hero mapping** (set `heroImage` to the destination art): bali-winter-escape→`/images/destinations/bali.svg`; black-sea-summer→`black-sea-coast.svg`; danube-delta-slow-escape→`danube-delta.svg`; roman-holiday→`rome.svg`; santorini-sunsets→`santorini.svg`; transylvania-5-days→`brasov-carpathians.svg`.

**Wire images in:**
- `DestinationCard.astro` already renders `heroImage` — add `loading="lazy"` `decoding="async"` `width`/`height` to the `<img>`; keep the scrim + white-text path.
- `PackageCard.astro` currently has **no image** — add the same `heroImage` treatment (image + `from-black/65` scrim + white title/tagline/pills when an image is present; keep the tinted fallback when absent).
- `destinations/[slug].astro`: hero already supports `heroImage`; add a **gallery** section from `gallery` (responsive grid of the 3 tiles, `rounded-2xl`, lazy, real `alt`). Consider a small reusable `DestinationGallery.astro`.
- `packages/[slug].astro`: add the `heroImage` to the hero header (image + scrim behind the existing white text).

**Package frontmatter to add** (before each `tagline:` line; you already have this pattern from destinations):
- bali-winter-escape: `heroImage`/`heroImageAlt`, `seasonMonths: [4,5,6,7,8,9,10]`, `activities: ["Beaches","Yoga & wellness","Volcano hike","Temples"]`
- black-sea-summer: `[6,7,8,9]`, `["Beaches","Swimming","Old town"]`
- danube-delta-slow-escape: `[5,6,7,8,9,10]`, `["Boat safaris","Birdwatching","Fishing villages"]`
- roman-holiday: `[3,4,5,9,10,11]`, `["Sightseeing","Museums","Food"]`
- santorini-sunsets: `[5,6,7,8,9,10]`, `["Sunsets","Beaches","Wine tasting"]`
- transylvania-5-days: `[4,5,6,7,8,9,10]`, `["Old towns","Castles","Mountain scenery"]`

## 2) Smart search (the homepage box is currently visual-only — make it real)
Build a **dependency-free, client-side** natural-language search over the catalog (8 + 6 = tiny → no server/AI needed).

- `src/lib/search.ts` — **pure module, no Astro imports, erasable TS types only** (so it runs under `node --experimental-strip-types` for tests). Exports item types, `buildIndex(items)`, and `search(query, index)` returning `{ results: ranked[], facets }`.
- **Facet parser** extracts: **vibes** via a synonym map (beach/seaside→beach; mountain/hiking/alps→mountain; city/"city break"/urban→city-break; history/historic/monuments/ruins/castle→historical-monuments; sightseeing/landmarks/attractions→tourist-attractions; nature/landscape/wildlife/forest→nature-landscapes; adventure/adrenaline→adventure; relax/wellness/spa/honeymoon/romantic→relaxation-wellness); **price** ("under/below €1000", "<1000", "budget"/"cheap"→low cap, "luxury"/"premium"→high floor); **duration** ("7 days", "a week"→~7, "weekend"→2–3); **month/season** (month names/abbrevs→1–12; winter→12,1,2; spring→3,4,5; summer→6,7,8; autumn/fall→9,10,11); **people** ("2 people"/"for two"/"couple"→2; "family"→~4); **country/city** tokens matched (with fuzzy) against country + `city`. Remaining tokens → fuzzy free-text.
- **Fuzzy**: normalise (lowercase, strip diacritics) then token-includes OR Levenshtein ≤ ~2 / trigram similarity, so `grece`→Greece, `santornini`→Santorini, `mountian`→mountain.
- **Scoring**: weighted (exact country/city high; vibe; activity; price-within-budget; month; fuzzy text), sort desc, drop near-zero. Return the parsed `facets` for "interpreted as" chips.
- `src/pages/search.astro`: embeds the index as JSON built from `getCollection` at build time; reads `?q=`; client runs `search()` and renders results as `DestinationCard`/`PackageCard` in two groups (Destinations, Trips), a row of "interpreted as" facet chips, a live result count, an **empty state** (suggest the 8 vibes + link to `/contact`), and a refine input prefilled with `q`.
- Homepage `index.astro`: make the search `<form method="get" action="/search">` with the input `name="q"`; delete the "Coming soon" note/handler; keep the gradient box + example chips (chips fill the input, or link to `/search?q=…`). Preserve design and a11y.

## 3) Filtering (only a vibe-chip filter exists today)
Shared **`FilterBar.astro`** + client module **`src/scripts/listing-filters.ts`**. Real-time, **combinable**, **URL-synced** (querystring so it's shareable + back-button friendly), with a live count, "Clear all", and an empty state. Do not break the existing vibe deep-links (`/vibe/{slug}` chips + `#vibe=`/`?vibe=`): pre-activate that vibe on load. Keep `aria-pressed`, Space/Enter keyboard toggle, and the sr-only `role="status"`.

Cards expose data for filtering via `data-*`: `data-vibes` (space list, exists), plus `data-region`, `data-country`, `data-months` (csv), `data-price-from`, `data-price-to`, `data-duration`, `data-title`, and `data-search` (a lowercased haystack of title+country+city+tagline+vibes+activities).

- **`/destinations`** controls: keyword, vibe (multi chips), region (Romania / International), month ("when do you want to go?" → matches `seasonMonths`). (No price/duration — destinations aren't priced or timed.)
- **`/packages`** controls: keyword, vibe (multi), **budget** (applied to per-person `priceTo` × travellers as an estimated total; presets Any / ≤€500 / ≤€1000 / ≤€1500 / €1500+), **duration** (Any / 1–4 / 5–7 / 8+ days), **month**, **travellers** (1–8; scales the budget estimate and is passed through to the Enquire link), region. Show the estimated total per card when travellers > 1.

Prefer one shared module used by both pages over copy-paste.

## 4) Contact vs Enquire split
Today `/contact` **is** the booking form and the "Enquire" CTAs deep-link to it. Split them:

- **New `src/pages/enquire.astro`** = the current booking form moved verbatim (name, email, trip select + `?trip=&title=` prefill, travel dates with To-≥-From check, travellers adults/children/pets, message, honeypot, consent, validation, success/error, a11y). **Add a Budget select** (Any / <€500 / €500–1000 / €1000–2000 / €2000+). Insert to the existing **`enquiries`** table using **existing columns only** — fold budget (and any filter context) into the `message` text (e.g. prepend `Budget: …`). Support optional prefill from filters (`?adults=&children=&budget=&from=&to=`). Title/copy = trip enquiries & booking requests.
- **Rewrite `src/pages/contact.astro`** to a **minimal general contact form**: Full Name, Email, Subject, Message, consent — nothing vacation-specific. Purpose: general questions, support, partnerships, company info. Insert to a **new `contact_messages`** table. Because live SQL can't run here, make submit **resilient**: on insert error (table not yet created) fall back to a prefilled `mailto:alexandrugabrielnicola8@gmail.com` (subject + body) and still show a graceful confirmation. 
- **`supabase/contact_messages.sql`**: versioned, RLS on, single insert-only policy for `anon`+`authenticated` (mirror `supabase/enquiries.sql`), columns `id, created_at, name, email, subject, message, consent, consent_text, status`. Header comment: "NOT yet run — run once in the Supabase SQL editor," like the existing pending scripts.
- Update **all** Enquire CTAs in `destinations/[slug].astro` and `packages/[slug].astro` from `/contact?…` to `/enquire?…`.
- (Optional) extend `admin.astro` + `supabase/admin_read_policies.sql` to also read `contact_messages`, behind the same "policy pending" caveat.

## 5) Dedupe + nav + chatbot
- Extract a shared **`SiteFooter.astro`** (optional `current` prop for `aria-current`) and replace the duplicated footer block across `index`, `about`, `privacy`, `contact`, `enquire`, `destinations/index`, `destinations/[slug]`, `packages/index`, `packages/[slug]`, `vibe/[slug]`, `admin`. Add **Enquire** and keep **Contact** links.
- Keep header nav (Destinations / Trips / About / Contact).
- Update the `src/pages/api/chat.ts` system prompt so it routes **booking/enquiries → `/enquire`** and **general questions/support → `/contact`** (it currently says `/contact` for everything). Optionally enrich the catalog lines with `city`/`activities`.

## Verification (must do)
1. `npm run build` passes clean (content schema validates; all references resolve; 30+ pages). Fix any type/schema errors.
2. **Unit-test the search logic**: add `test/search.test.ts` run with `node --experimental-strip-types --test`. Assert sensible top results for: `beach holiday`, `Greece`, `Italy`, `Paris` (→ closest / empty-state ok), `family vacation`, `honeymoon`, `city break`, `mountain trip`, `under €1000`, `luxury`, `budget`, `adventure`, `2 people`, `July`, `7 days`, and misspellings `grece`/`santornini`/`mountian`. Keep `search.ts` erasable-types-only so strip-types runs; fix until green.
3. Dev-server smoke (static shells): `curl -s -o /dev/null -w "%{http_code}"` for `/`, `/search?q=beach%20under%201000`, `/enquire`, `/contact`, `/destinations`, `/packages`, `/destinations/santorini`, `/packages/santorini-sunsets` → all 200; grep built HTML for the new controls/markers.
4. Responsive: confirm mobile-first classes hold at ~375 / 768 / 1280 (headless browser if available; else static review). No horizontal overflow; images use lazy loading + width/height (no layout shift).
5. Confirm no regression to the working `enquiries` insert (existing columns only) and that no secret is bundled (`grep dist/` for the Gemini key / `service_role`).
6. Commit incrementally **by explicit path** (not `-A`); keep the unrelated doc edits out. Then update `BUILD-STATUS.md` (snapshot + a log line + date) — but don't re-upload/commit unrelated doc churn.

## Deliverables (end of run)
1. Summary of every change. 2. List of modified/created files. 3. Key implementation decisions (esp. images-as-SVG, budget×travellers, month = honest "departure date", contact_messages pending SQL + mailto fallback). 4. Future recommendations (real photos via `astro:assets`, real prices, run the pending SQL, EUR/RON toggle). 5. Confirmation that build + search tests pass and no existing feature was broken.
