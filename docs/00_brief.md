# 00 — Brand & Brief
*Source of truth for brand, voice, and starter catalog. Created in the "Brand & Brief" chat. Keep current as decisions change.*

---

## Decisions locked in this chat
- **Platform type:** **Both** — Voia is a *discovery → booking* platform. Users find a destination by vibe, then can book a curated trip. **This resolves the open decision in `00_project-overview`.**
- **Audience:** "For everyone" — treated as a design principle (mobile-first, plain language, every budget) with a few named core segments below.
- **Voice:** Warm & friendly.
- **Region:** Romania as the local hero, surrounded by well-known international destinations.

**👉 Knowledge files to update after this chat**
1. Save this file as **`00_brief.md`**.
2. In **`00_project-overview.md`**, change the "Open decision" line to: *Resolved — both (discovery → booking). See `00_brief`.*
3. Later, when we build the catalog for real, the structured destination/package data will live in **`03_content.md`** (and ultimately Astro content collections). This brief is the creative source it's built from.

---

## Brand
**Name:** **Voia**

**Tagline (primary):** *Travel the way you feel.*

**Alternate taglines** (for different placements):
- *Pick a vibe. Find your place.*
- *Start with a feeling. End with a trip.*

**Why the name:** "Voia" comes from the Romanian phrase *după voia ta* — roughly *"as you please / as the mood takes you."* It's short, warm, easy to say in any language, and it captures the whole product idea: most travel sites ask **"Where to?"** before you even know. Voia starts from the **feeling** instead.

> *Note: "Voia" is a fictional brand invented for this university project. Worth a quick name/domain check before any real use.*

---

## Backstory (short)
Voia started with a frustrated traveler staring at a blank search box. She knew she wanted *somewhere warm and slow* for winter — but the website wanted a city name, and she didn't have one. So she built the site she wished existed: one that begins with a **vibe** (beach, mountains, a buzzing city, deep nature) and matches you to a place, instead of demanding you already know the answer.

Rooted in Romania, Voia pairs the country's underrated gems — painted monasteries, wild deltas, fairy-tale old towns — with the world's icons, then helps you actually go. It's travel planning that feels less like a spreadsheet and more like a well-travelled friend saying *"oh, you'll love this one."*

---

## Target audience
The unifying trait across every Voia traveler: **they choose by mood, not by map.** "For everyone" is a real design goal — the experience has to work on a phone, in plain words, on any budget. Within that, four core segments keep the catalog balanced:

- **Curious students & first-time travellers** — budget-aware, adventurous, want a cheap win and an easy "yes."
- **Couples & solo explorers** — chasing a calm escape, a romantic view, or a city to get lost in.
- **Families** — need low-stress, all-ages trips that just work.
- **Romanians discovering home & abroad** — proud-of-Romania day-trippers and first international flyers alike.

---

## Brand voice
Voia sounds like a **warm, well-travelled friend** — encouraging, clear, a little playful, never pushy.

**Principles**
- **Plain & human.** Short sentences. Second person ("you"). No travel-agent jargon.
- **Inclusive & budget-aware.** A weekend in the Carpathians is celebrated as much as two weeks in Bali.
- **Inspiring, not hype-y.** We paint the feeling; we don't shout "ONCE-IN-A-LIFETIME!!!"
- **Helpful & honest.** If something's seasonal, crowded, or pricey, we say so.

**Do / Don't**

| Do | Don't |
|---|---|
| "Somewhere warm and slow? Try Santorini in May." | "Unbeatable luxury escapes await — book now!" |
| "Great for a first trip abroad — easy and walkable." | "An exclusive bucket-list experience for discerning travellers." |
| "Heads up: August on the Black Sea gets busy." | (hiding the downsides) |

**Sample lines in voice**
- Homepage intro: *"Tell us the kind of trip you're dreaming of — we'll find the place."*
- Empty search prompt: *"Not sure where? Just describe the vibe. 'Warm in winter', 'somewhere like Santorini', 'mountains and quiet'."*
- Chatbot greeting: *"Hi! I'm your Voia guide. What kind of trip are you in the mood for?"*

---

## Starter catalog — 8 destinations
A balanced **4 Romanian + 4 international** mix. Each is tagged with the **8 homepage vibe categories** (Beach · Mountain · City Break · Historical Monuments · Tourist Attractions · Nature & Landscapes · Adventure · Relaxation & Wellness) so they map 1:1 to the selector.

| # | Destination | Country | Vibe match | Best season (general) | Why go |
|---|---|---|---|---|---|
| 1 | **Brașov & the Carpathians** | 🇷🇴 Romania | Mountain · City Break · Historical Monuments · Adventure | Year-round (snow in winter, hiking in summer) | Fairy-tale medieval old town with mountains on the doorstep; Bran "Dracula's" Castle nearby. |
| 2 | **Danube Delta** | 🇷🇴 Romania | Nature & Landscapes · Adventure · Relaxation & Wellness | Late spring–early autumn | Europe's largest wetland (UNESCO) — boat safaris, birds, total quiet. |
| 3 | **Sibiu & the Transfăgărășan** | 🇷🇴 Romania | City Break · Historical Monuments · Adventure · Mountain | Late spring–autumn (the mountain road closes in winter) | A storybook Saxon city beside one of the world's most spectacular driving roads. |
| 4 | **Black Sea Coast (Constanța / Mamaia)** | 🇷🇴 Romania | Beach · Relaxation & Wellness · Tourist Attractions | Summer (Jun–Sep) | Romania's seaside — sandy beaches, a lively resort strip, seafront city sights. |
| 5 | **Santorini** | 🇬🇷 Greece | Beach · Relaxation & Wellness · Tourist Attractions | Late spring–early autumn | The classic "somewhere like Santorini" — caldera sunsets, white-and-blue villages. |
| 6 | **Rome** | 🇮🇹 Italy | City Break · Historical Monuments · Tourist Attractions | Spring & autumn (mild, fewer crowds) | The history heavyweight — the Colosseum, the Vatican, food on every corner. |
| 7 | **Swiss Alps (Interlaken)** | 🇨🇭 Switzerland | Mountain · Adventure · Nature & Landscapes | Summer (hiking) & winter (snow) | Big-mountain drama and adrenaline — peaks, lakes, paragliding, rail journeys. |
| 8 | **Bali** | 🇮🇩 Indonesia | Beach · Relaxation & Wellness · Nature & Landscapes · Adventure | Dry season (roughly Apr–Oct) | The flagship "warm in winter" — beaches, rice terraces, yoga, volcano hikes. |

*Coverage check: all 8 vibe categories appear at least three times, so the homepage selector will always return matches.*

---

## Tour packages — 6 (because we sell trips)
3 Romania-based + 3 international, spanning budget → premium so there's something for every traveller.

> ⚠️ **Prices are indicative placeholders for the project — not real quotes.** They're plausible ranges to make the UI feel real; replace with actual supplier pricing before anything is presented as fact. All prices are per person, double occupancy, in EUR.

| # | Package | Based on | Theme / vibe | Duration | Indicative price *(placeholder)* | Great for |
|---|---|---|---|---|---|---|
| 1 | **Transylvania in 5 Days** | Brașov · Bran · Sibiu | Historical Monuments · City Break · Mountain | 5 days | €390–€520 *(land only)* | Students & first-timers; a budget-friendly classic. |
| 2 | **Danube Delta Slow Escape** | Danube Delta | Nature & Landscapes · Relaxation & Wellness · Adventure | 4 days | €340–€460 *(land only)* | Couples & nature lovers who want quiet. |
| 3 | **Black Sea Summer** | Constanța / Mamaia | Beach · Relaxation & Wellness | 5 days | €300–€450 *(land only)* | Families & friend groups on a budget. |
| 4 | **Santorini Sunsets** | Santorini | Beach · Relaxation & Wellness | 6 days | €780–€1,150 *(flights + hotel)* | Couples & a romantic milestone. |
| 5 | **Roman Holiday** | Rome | City Break · Historical Monuments · Tourist Attractions | 4 days | €520–€780 *(flights + hotel)* | City lovers & culture seekers. |
| 6 | **Bali Winter Escape** | Bali | Beach · Relaxation & Wellness · Adventure | 8 days | €1,250–€1,800 *(flights + hotel)* | The "warm in winter" splurge; wellness travellers. |

*(The Swiss Alps stays a discovery-only destination for now — great for the vibe selector and custom search, without a packaged trip.)*

---

## Placeholders & gaps to fill (kept honest)
Per our "never invent facts" rule, these are **not yet real** and must be sourced before publishing:
- **All package prices** — indicative ranges only.
- **Operational details** — exact durations/itineraries, hotel names, opening hours, what's included/excluded.
- **Photos & licensing** — every destination needs properly licensed imagery.
- **Currency** — decide EUR vs RON for display (or both), especially for Romanian trips.
- **Affiliate vs direct booking — RESOLVED (9 Jul 2026):** direct / in-house — bookings start as an **enquiry → Supabase** (the `/contact` form), not affiliate links. See `03_content.md` §8 and `BUILD-STATUS.md`.

---

## Suggested next steps (one task per chat)
1. **Design system** (`02_design-system`) — colours, type, and the look of the vibe cards, so the homepage build has a style to follow.
2. **Homepage / Vacation Selector build** — turn the 8 categories + custom search into the real Astro page.
3. **Content modelling** (`03_content`) — define the destination & package fields, then enter this catalog as structured data.

Tell me which one you'd like to tackle next and I'll set it up.
