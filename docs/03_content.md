# 03 — Content Model & Catalog
*The structured source of truth for Voia's destinations and tour packages. Field definitions + the full starter catalog (8 destinations, 6 packages) with drafted copy. This is what the Astro content collections are built from. Created in the "Destinations" chat.*

> **How to use this file**
> 1. Save it to the Project knowledge as **`03_content.md`**.
> 2. Also drop a copy into the **Voia repo** (suggested path `docs/03_content.md`) and commit it, so Claude Code can read it while building. The build prompt for this task looks for it there.
> 3. Everything in §6–§7 maps 1:1 to content-collection files. The build prompt turns each entry into a `.md` file under `src/content/`.

---

## 1 · Two collections + how they connect

Voia is a **discovery → booking** platform (`00_brief`), so the content has two linked collections:

- **`destinations`** — the 8 places you can discover by vibe. (What the homepage vibe selector leads to.)
- **`packages`** — the 6 bookable trips, each based on one or more destinations.

**Relationships**
- A **destination → its package** (optional, one). Powers the "Trips you can book here" card on a destination page. *Swiss Alps has no package (discovery-only), so this field is optional.*
- A **package → its destination(s)** (one or more). Powers "Based in…" links on a package page.
- Both link to the **8 vibes** via a `vibes` list (validated against the fixed 8), so they slot straight into the selector and the `/vibe/{slug}` pages.

The `slug` for every entry = **its filename** (e.g. `santorini.md` → `/destinations/santorini`). We don't repeat the slug inside the file, to avoid two sources of truth drifting apart.

---

## 2 · Destination — field model

| Field | Type | Required | Notes |
|---|---|---|---|
| *(slug)* | from **filename** | ✅ | The `.md` filename **is** the URL slug. Don't duplicate in frontmatter. |
| `title` | string | ✅ | Display name, e.g. "Brașov & the Carpathians". |
| `country` | string | ✅ | e.g. "Romania". |
| `countryFlag` | string (emoji) | ✅ | e.g. "🇷🇴". |
| `region` | `"romania"` \| `"international"` | ✅ | Local-hero vs international (for grouping/badges). |
| `vibes` | array of vibe slugs (the 8) | ✅ | ≥1. **Validated** against the fixed 8 (see §5) — a typo fails the build. |
| `bestSeason` | string | ✅ | General, human-readable ("Year-round", "Late spring–early autumn"). |
| `tagline` | string | ✅ | One line, Voia's voice. Used on cards + as the SEO description fallback. |
| `highlights` | array of strings | ✅ | 3–6 **real, well-known** things to see/do. |
| `goodToKnow` | array of strings | ⬜ | Honest heads-ups (seasonality, crowds, cost). |
| `bestFor` | array of strings | ⬜ | Audience tags ("First-time travellers", "Couples"). |
| `package` | reference → `packages` | ⬜ | The trip based here, **if any**. Optional (Swiss Alps = none). |
| `featured` | boolean (default `false`) | ⬜ | For a future "featured destinations" section. |
| `heroImage` | string (path) | ⬜ | **Omit for now** — no licensed photos yet → gradient placeholder. |
| `heroImageAlt` | string | ⬜ | Required only if `heroImage` is set. |
| `seoDescription` | string | ⬜ | Overrides `tagline` for `<meta description>` if needed. |
| **body** (markdown) | — | ✅ | The "why-go" long copy (below the frontmatter). |

**Worked example — `src/content/destinations/santorini.md`:**
```md
---
title: "Santorini"
country: "Greece"
countryFlag: "🇬🇷"
region: "international"
vibes: ["beach", "relaxation-wellness", "tourist-attractions"]
bestSeason: "Late spring–early autumn"
tagline: "The white-and-blue one — and yes, those sunsets."
highlights:
  - "Caldera-edge villages of Oia and Fira"
  - "The famous sunset over the volcano"
  - "Black- and red-sand beaches"
  - "The ancient site of Akrotiri"
goodToKnow:
  - "Popular for a reason — summer gets crowded and pricey. Late spring or early autumn gives you the light and warmth with more breathing room."
bestFor: ["Couples", "A romantic milestone"]
package: santorini-sunsets
featured: false
---

Santorini is the postcard: whitewashed villages spilling down cliffs above a
flooded volcanic crater, blue domes, and a sunset people cross the world to see.
It's the classic answer to "somewhere like Santorini," because it *is* Santorini —
caldera views, cliffside pools, and beaches in unexpected black and red.

Wander Oia and Fira, catch the light in the evening, and slow right down. It leans
romantic, so it's a favourite for couples and milestone trips.
```

---

## 3 · Package — field model

| Field | Type | Required | Notes |
|---|---|---|---|
| *(slug)* | from **filename** | ✅ | Filename = URL slug. |
| `title` | string | ✅ | e.g. "Transylvania in 5 Days". |
| `destinations` | array of references → `destinations` | ✅ | ≥1. The place(s) it's based on. |
| `vibes` | array of vibe slugs (the 8) | ✅ | Theme tags (validated, §5). |
| `durationDays` | number | ✅ | e.g. `5`. |
| `priceFrom` | number | ✅ | ⚠️ **PLACEHOLDER** (see §8). |
| `priceTo` | number | ✅ | ⚠️ **PLACEHOLDER**. |
| `currency` | string (default `"EUR"`) | ✅ | EUR for now (RON is an easy later toggle — §8). |
| `priceBasis` | `"land-only"` \| `"flights-hotel"` | ✅ | From the brief — changes what the price covers. |
| `priceIsPlaceholder` | boolean (default `true`) | ✅ | Drives the "indicative — not a real quote" flag in the UI. Keep `true` until real prices exist. |
| `priceNote` | string | ⬜ | Default: *"Per person, double occupancy. Indicative placeholder — not a real quote."* |
| `tagline` | string | ✅ | One line, Voia's voice. Card + SEO fallback. |
| `greatFor` | array of strings | ✅ | Audience ("Students & first-timers"). |
| `highlights` | array of strings | ⬜ | **Real** places/experiences — *not* invented day-by-day detail. |
| `itinerary` | array of `{ day, title, detail }` | ⬜ | ⚠️ **GAP — leave empty.** Page shows a "coming soon / to be confirmed" note. |
| `included` | array of strings | ⬜ | ⚠️ **GAP — leave empty.** |
| `excluded` | array of strings | ⬜ | ⚠️ **GAP — leave empty.** |
| `featured` | boolean (default `false`) | ⬜ | |
| `heroImage` / `heroImageAlt` | string | ⬜ | Omit for now — gradient placeholder. |
| `seoDescription` | string | ⬜ | Overrides `tagline` for meta if needed. |
| **body** (markdown) | — | ✅ | Trip description (below frontmatter). |

**Worked example — `src/content/packages/santorini-sunsets.md`:**
```md
---
title: "Santorini Sunsets"
destinations: ["santorini"]
vibes: ["beach", "relaxation-wellness"]
durationDays: 6
priceFrom: 780
priceTo: 1150
currency: "EUR"
priceBasis: "flights-hotel"
priceIsPlaceholder: true
tagline: "Six days of caldera views and slow romance."
greatFor: ["Couples", "A romantic milestone"]
highlights:
  - "Sunsets over the volcano from Oia"
  - "Whitewashed villages and blue domes"
  - "Santorini's black- and red-sand beaches"
  - "Long, unhurried Greek evenings"
itinerary: []      # TODO — day-by-day to be confirmed
included: []       # TODO
excluded: []       # TODO
featured: false
---

A romantic six days on the Aegean's most photogenic island — cliffside villages,
endless sea views, and that famous sunset every evening.

It's shaped for couples and milestone trips: slow mornings, good food, and time to
just take in the view. The splurge that earns its keep.
```

---

## 4 · Page structure (what the build produces)

- `/destinations` — index of all 8, with **vibe filter chips**.
- `/destinations/{slug}` — destination detail (why-go, highlights, good-to-know, best season, + its bookable trip if any).
- `/vibe/{slug}` — **the pages the homepage already links to.** One per vibe; lists the destinations *and* trips tagged with that vibe.
- `/packages` — index of all 6 trips.
- `/packages/{slug}` — trip detail (price with placeholder flag, highlights, "based in…" links, itinerary/inclusions placeholders).

---

## 5 · The 8 vibes (reference)

These are the fixed categories. **The `slug` column must exactly match the `/vibe/{slug}` links the homepage already uses** — the homepage is the source of truth for the strings; align this table to it if they differ (the build prompt double-checks this). Icons are Lucide, matching the homepage.

| # | Vibe | `slug` | Icon (Lucide) | Card teaser | Vibe-page intro line |
|---|---|---|---|---|---|
| 1 | Beach | `beach` | `Umbrella` | "Sand, sea, and slow days." | "Somewhere to slow down by the water — here's where to find sand and sea." |
| 2 | Mountain | `mountain` | `Mountain` | "Peaks, trails, and fresh air." | "Fresh air, big views, and trails to match. These places have the mountains." |
| 3 | City Break | `city-break` | `Building-2` | "Cafés, streets, and good chaos." | "Streets to wander and cafés to linger in — city breaks with character." |
| 4 | Historical Monuments | `historical-monuments` | `Landmark` | "Castles, ruins, and old stories." | "Castles, ruins, and centuries of stories — history you can stand inside." |
| 5 | Tourist Attractions | `tourist-attractions` | `Camera` | "The big sights, worth the trip." | "The famous, bucket-list sights — the ones worth the trip." |
| 6 | Nature & Landscapes | `nature-landscapes` | `Trees` | "Forests, deltas, and big views." | "Forests, water, and wide-open views. Nature, front and centre." |
| 7 | Adventure | `adventure` | `Compass` | "A little adrenaline, a lot of yes." | "A bit of adrenaline and a lot of yes — for trips with a pulse." |
| 8 | Relaxation & Wellness | `relaxation-wellness` | `Flower-2` | "Spa days and deep exhales." | "Spa days, quiet, and a proper exhale. Come back rested." |

**Coverage check (destinations per vibe):** beach 3 · mountain 3 · city-break 3 · historical-monuments 3 · tourist-attractions 3 · nature-landscapes 3 · adventure 5 · relaxation-wellness 4. Every vibe returns ≥3 destinations, so no vibe page is ever empty. ✅

---

## 6 · Destinations — full catalog (8)

*Copy below is drafted in Voia's voice from well-known facts. Review and edit freely. No prices/hours/operational specifics are stated here — those live in §8 as gaps.*

### 1 · Brașov & the Carpathians  →  `brasov-carpathians.md`
- **country:** Romania · 🇷🇴 · **region:** `romania`
- **vibes:** `mountain`, `city-break`, `historical-monuments`, `adventure`
- **bestSeason:** "Year-round — snow in winter, hiking in summer"
- **package:** `transylvania-5-days`
- **featured:** `true`
- **bestFor:** First-time travellers · Couples · Families
- **tagline:** "Fairy-tale streets with the mountains right there."
- **highlights:**
  - Council Square (Piața Sfatului) and the Gothic Black Church
  - The Tâmpa cable car, for a view over the red rooftops
  - Bran "Dracula's" Castle, a short trip away
  - Trailheads that start right at the edge of town
- **goodToKnow:**
  - Winter turns it into a snow-globe — lovely to look at, cold for long wanders. Summer is prime hiking weather.
- **Why go (body):**
  Brașov is the storybook one — pastel townhouses, a wide medieval square, and the dark spire of the Black Church, all tucked under forested Carpathian peaks. You can spend the morning getting lost in the old town and the afternoon on a mountain trail without ever getting in a car. Nearby Bran Castle carries the Dracula legend, and the ridgelines around town make it an easy base for everything from gentle walks to proper hikes. It's Romania at its most instantly lovable — and an easy "yes" for a first trip here.

### 2 · Danube Delta  →  `danube-delta.md`
- **country:** Romania · 🇷🇴 · **region:** `romania`
- **vibes:** `nature-landscapes`, `adventure`, `relaxation-wellness`
- **bestSeason:** "Late spring–early autumn"
- **package:** `danube-delta-slow-escape`
- **bestFor:** Couples · Nature lovers
- **tagline:** "Europe's wildest quiet, explored by boat."
- **highlights:**
  - Boat safaris through reed channels and lily-covered lakes
  - Hundreds of bird species, including pelicans
  - Sleepy fishing villages you can only reach by water
  - Sunrise stillness you can't fake
- **goodToKnow:**
  - It's remote and weather-dependent; late spring to early autumn is the window. Bring bug spray and patience — the reward is total calm.
- **Why go (body):**
  Where the Danube finally meets the Black Sea, it fans out into Europe's largest and best-preserved river delta — a UNESCO-listed maze of channels, reedbeds, and lakes. You explore it slowly, by boat, gliding past pelicans and herons toward villages with no roads in. There's not much to "do" here in the usual sense, and that's exactly the point: it's one of the quietest, wildest corners of the continent. Come to switch off, drift, and watch the birds.

### 3 · Sibiu & the Transfăgărășan  →  `sibiu-transfagarasan.md`
- **country:** Romania · 🇷🇴 · **region:** `romania`
- **vibes:** `city-break`, `historical-monuments`, `adventure`, `mountain`
- **bestSeason:** "Late spring–autumn (the mountain road closes in winter)"
- **package:** `transylvania-5-days`
- **bestFor:** Couples · Road-trippers · Culture seekers
- **tagline:** "A Saxon old town beside a legendary mountain road."
- **highlights:**
  - The Grand and Small Squares, and the famous "eyes of Sibiu" rooftops
  - The Bridge of Lies
  - The Transfăgărășan's switchbacks up to glacial Bâlea Lake
  - Big-view drives and hikes in the Făgăraș mountains
- **goodToKnow:**
  - The Transfăgărășan only opens in the warmer months (usually summer into early autumn) and closes with the snow — **check current opening dates** before you plan around it.
- **Why go (body):**
  Sibiu is a beautifully preserved Saxon city — cobbled squares, pastel façades, and those distinctive eyebrow-window rooftops that look like the houses are watching you. Just south, the Transfăgărășan carves through the Făgăraș mountains in a ribbon of hairpin bends, climbing to the glacial Bâlea Lake — one of the most spectacular driving roads anywhere. Pair the two and you get culture and cobblestones in the morning, high-mountain drama in the afternoon. It's Transylvania showing off.

### 4 · Black Sea Coast (Constanța / Mamaia)  →  `black-sea-coast.md`
- **country:** Romania · 🇷🇴 · **region:** `romania`
- **vibes:** `beach`, `relaxation-wellness`, `tourist-attractions`
- **bestSeason:** "Summer (Jun–Sep)"
- **package:** `black-sea-summer`
- **bestFor:** Families · Friend groups · Budget travellers
- **tagline:** "Romania's seaside summer — sand and all."
- **highlights:**
  - The long sandy strip at Mamaia
  - Constanța's seafront old town and its landmark Casino
  - Traces of ancient Tomis, right by the water
  - Lively beach terraces when the sun goes down
- **goodToKnow:**
  - This is a summer destination — July and August are the busy, buzzing peak. Come in June or September for the same sea with fewer crowds.
- **Why go (body):**
  Mamaia is Romania's headline beach resort — a slim sandbar of golden sand between the sea and a lake, lined with hotels, terraces, and a summer-long buzz. Next door, Constanța is one of the country's oldest cities, where you can trade the beach for a wander past the restored seafront Casino and traces of ancient Tomis. It's the easy, cheerful choice for a sun-and-sea break without leaving the country — best in high summer, when the whole coast comes alive.

### 5 · Santorini  →  `santorini.md`
- **country:** Greece · 🇬🇷 · **region:** `international`
- **vibes:** `beach`, `relaxation-wellness`, `tourist-attractions`
- **bestSeason:** "Late spring–early autumn"
- **package:** `santorini-sunsets`
- **bestFor:** Couples · A romantic milestone
- **tagline:** "The white-and-blue one — and yes, those sunsets."
- **highlights:**
  - Caldera-edge villages of Oia and Fira
  - The famous sunset over the volcano
  - Black- and red-sand beaches
  - The ancient site of Akrotiri
- **goodToKnow:**
  - Popular for a reason — summer gets crowded and pricey. Late spring or early autumn gives you the light and warmth with more breathing room.
- **Why go (body):**
  Santorini is the postcard: whitewashed villages spilling down cliffs above a flooded volcanic crater, blue domes, and a sunset people cross the world to see. It's the classic answer to "somewhere like Santorini," because it *is* Santorini — caldera views, cliffside pools, and beaches in unexpected black and red. Wander Oia and Fira, catch the light in the evening, and slow right down. It leans romantic, so it's a favourite for couples and milestone trips.

### 6 · Rome  →  `rome.md`
- **country:** Italy · 🇮🇹 · **region:** `international`
- **vibes:** `city-break`, `historical-monuments`, `tourist-attractions`
- **bestSeason:** "Spring & autumn (mild, fewer crowds)"
- **package:** `roman-holiday`
- **bestFor:** City lovers · Culture seekers
- **tagline:** "Three thousand years of history, and dinner on every corner."
- **highlights:**
  - The Colosseum and the Roman Forum
  - Vatican City, St Peter's, and the Sistine Chapel
  - The Pantheon and the Trevi Fountain
  - Long, food-filled evenings in Trastevere
- **goodToKnow:**
  - Summer is hot and packed; spring and autumn are milder and calmer. Whenever you go, the big sights reward booking ahead.
- **Why go (body):**
  Rome is the history heavyweight — a city where ancient ruins, Renaissance masterpieces, and everyday life all pile on top of each other. You can stand in the Colosseum, throw a coin in the Trevi, cross into Vatican City, and still make time for pasta and gelato before dark. It rewards both the checklist and the aimless wander down a cobbled backstreet. Go in spring or autumn for the kindest weather.

### 7 · Swiss Alps (Interlaken)  →  `swiss-alps-interlaken.md`
- **country:** Switzerland · 🇨🇭 · **region:** `international`
- **vibes:** `mountain`, `adventure`, `nature-landscapes`
- **bestSeason:** "Summer (hiking) & winter (snow)"
- **package:** *(none — discovery-only for now)*
- **bestFor:** Adventure seekers · Mountain lovers
- **tagline:** "Big mountains, bluer lakes, and a serious rush."
- **highlights:**
  - Two turquoise lakes, with Interlaken between them
  - The Jungfrau region and the "Top of Europe" railway
  - Paragliding over the valley
  - The waterfalls and cliffs of nearby Lauterbrunnen
- **goodToKnow:**
  - Switzerland is famously not cheap — build in some budget headroom. Summer is for hiking and paragliding; winter is for snow.
- **Why go (body):**
  Interlaken sits in a green valley between two vivid blue lakes, with the snow-capped Jungfrau massif rising behind — the launchpad for the big-mountain Swiss Alps. This is the adrenaline end of the catalog: paragliding off the hillsides, scenic rail up to glacier country, and the fairy-tale waterfalls of the Lauterbrunnen valley next door. Come in summer for hiking and flying, or in winter for the snow. It's drama on a grand scale. *(No packaged trip yet — explore this one your way.)*

### 8 · Bali  →  `bali.md`
- **country:** Indonesia · 🇮🇩 · **region:** `international`
- **vibes:** `beach`, `relaxation-wellness`, `nature-landscapes`, `adventure`
- **bestSeason:** "Dry season (roughly Apr–Oct)"
- **package:** `bali-winter-escape`
- **featured:** `true`
- **bestFor:** Wellness travellers · Couples · Adventurous explorers
- **tagline:** "Warm in winter, in every sense."
- **highlights:**
  - Rice terraces around Ubud and Tegallalang
  - Clifftop and beach temples like Uluwatu and Tanah Lot
  - Sunrise hikes up volcanic Mount Batur
  - A beach and wellness scene from surf towns to spa retreats
- **goodToKnow:**
  - The dry season (roughly April–October) is the sweet spot — which is exactly when a Romanian winter makes it so tempting. It's long-haul, so it suits a longer stay.
- **Why go (body):**
  Bali is the flagship "warm in winter" escape — a lush Indonesian island of emerald rice terraces, cliffside temples, and volcano silhouettes at dawn. It flexes to whatever you're after: surf and beach clubs on the coast, yoga and slow mornings in Ubud, waterfalls and rice-paddy walks inland. When it's grey and cold back home, this is the daydream. Give it a full week or more — it's a long way to go for a weekend.

---

## 7 · Tour packages — full catalog (6)

> ⚠️ **All prices are indicative placeholders for the project — not real quotes.** Per person, double occupancy, EUR. `priceIsPlaceholder: true` on every entry so the UI shows an "indicative" flag. Replace with real supplier pricing before anything is presented as fact. `itinerary`, `included`, and `excluded` are intentionally empty — see §8.

### 1 · Transylvania in 5 Days  →  `transylvania-5-days.md`
- **destinations:** `brasov-carpathians`, `sibiu-transfagarasan`
- **vibes:** `historical-monuments`, `city-break`, `mountain`
- **durationDays:** `5` · **price:** `390`–`520` EUR · **basis:** `land-only`
- **greatFor:** Students · First-timers
- **featured:** `true`
- **tagline:** "Castles, cobblestones, and mountains — the classic Romanian road trip."
- **highlights:**
  - Brașov's medieval old town
  - Bran "Dracula's" Castle
  - Sibiu's Saxon squares
  - Carpathian scenery between the stops
- **About this trip (body):**
  The greatest-hits loop through Transylvania: fairy-tale Brașov, the legend of Bran Castle, and the storybook streets of Sibiu, threaded together with Carpathian views. It's designed as an easy, budget-friendly first taste of Romania — big on atmosphere, light on logistics. A five-day classic for students, first-timers, and anyone who wants the highlights without overthinking it.

### 2 · Danube Delta Slow Escape  →  `danube-delta-slow-escape.md`
- **destinations:** `danube-delta`
- **vibes:** `nature-landscapes`, `relaxation-wellness`, `adventure`
- **durationDays:** `4` · **price:** `340`–`460` EUR · **basis:** `land-only`
- **greatFor:** Couples · Nature lovers
- **tagline:** "Four slow days in Europe's wildest wetland."
- **highlights:**
  - Guided boat safaris through the channels
  - Birdwatching, including pelicans
  - Quiet nights in a delta fishing village
  - Sunrises over the water
- **About this trip (body):**
  A deliberately unhurried few days in the Danube Delta — boat trips through the reeds, long stretches of birdsong and open water, and the kind of quiet that resets you. It's built for couples and nature lovers who want to swap notifications for herons and lily pads. Come to slow all the way down.

### 3 · Black Sea Summer  →  `black-sea-summer.md`
- **destinations:** `black-sea-coast`
- **vibes:** `beach`, `relaxation-wellness`
- **durationDays:** `5` · **price:** `300`–`450` EUR · **basis:** `land-only`
- **greatFor:** Families · Friend groups
- **tagline:** "Five easy days of sun, sand, and seaside."
- **highlights:**
  - Beach days on the Mamaia strip
  - A wander through Constanța's seafront old town
  - Lively evenings on the resort terraces
  - The most budget-friendly trip in the catalog
- **About this trip (body):**
  Straightforward seaside fun on Romania's Black Sea coast: sandy days at Mamaia, a bit of history and a stroll in Constanța, and easygoing summer evenings. It's the friendly, affordable pick for families and friend groups who just want sun and sea without the long-haul price tag. Pack the swimsuit and go.

### 4 · Santorini Sunsets  →  `santorini-sunsets.md`
- **destinations:** `santorini`
- **vibes:** `beach`, `relaxation-wellness`
- **durationDays:** `6` · **price:** `780`–`1150` EUR · **basis:** `flights-hotel`
- **greatFor:** Couples · A romantic milestone
- **featured:** `true`
- **tagline:** "Six days of caldera views and slow romance."
- **highlights:**
  - Sunsets over the volcano from Oia
  - Whitewashed villages and blue domes
  - Santorini's black- and red-sand beaches
  - Long, unhurried Greek evenings
- **About this trip (body):**
  A romantic six days on the Aegean's most photogenic island — cliffside villages, endless sea views, and that famous sunset every evening. It's shaped for couples and milestone trips: slow mornings, good food, and time to just take in the view. The splurge that earns its keep.

### 5 · Roman Holiday  →  `roman-holiday.md`
- **destinations:** `rome`
- **vibes:** `city-break`, `historical-monuments`, `tourist-attractions`
- **durationDays:** `4` · **price:** `520`–`780` EUR · **basis:** `flights-hotel`
- **greatFor:** City lovers · Culture seekers
- **tagline:** "Four days, three thousand years, endless pasta."
- **highlights:**
  - The Colosseum and ancient Rome
  - Vatican City and St Peter's
  - The Pantheon, Trevi, and Trastevere
  - Food breaks between the landmarks
- **About this trip (body):**
  A four-day dive into the Eternal City — the big-hitters of ancient and Renaissance Rome, with plenty of pasta and piazza time in between. It's made for culture seekers and city lovers who want the icons and the atmosphere in one tight, walkable trip. History, art, and dinner, all within reach.

### 6 · Bali Winter Escape  →  `bali-winter-escape.md`
- **destinations:** `bali`
- **vibes:** `beach`, `relaxation-wellness`, `adventure`
- **durationDays:** `8` · **price:** `1250`–`1800` EUR · **basis:** `flights-hotel`
- **greatFor:** Wellness travellers · The "warm in winter" splurge
- **featured:** `true`
- **tagline:** "Eight days of warmth when home is at its coldest."
- **highlights:**
  - Beach and surf towns on the coast
  - Ubud's rice terraces and wellness scene
  - A sunrise volcano hike
  - Temples, waterfalls, and long, warm days
- **About this trip (body):**
  The full "warm in winter" reset — eight days to trade a grey Romanian winter for Bali's beaches, rice terraces, and slow, sunlit mornings. It balances a bit of adventure with a lot of wellness, so you can hike a volcano one day and do nothing by the pool the next. The long-haul splurge for when you really need the sun.

---

## 8 · Gaps & TODOs (kept honest — never invent)

Per the project rule, these are **not yet real** and must be sourced before publishing. The UI is built to flag them, not hide them.

- **All package prices** — indicative ranges only (`priceIsPlaceholder: true`). Replace with real supplier quotes.
- **Itineraries** (`itinerary`) — no day-by-day yet. Pages show a "coming soon / to be confirmed" note.
- **Inclusions/exclusions** (`included` / `excluded`) — empty; flagged as "to be confirmed".
- **Operational details** — exact durations, hotel names, opening hours, transport. Not stated anywhere in copy.
- **Photos & licensing** — every destination/package needs properly licensed imagery. Until then, ship the **gradient / no-photo** placeholders (per `02_design-system` §7.1).
- **Currency** — EUR for now. Decide EUR vs RON (or both) for display, especially for Romanian trips. `currency` field makes this a small change.
- **Booking mechanism** — still undecided (affiliate links vs in-house **inquiry → Supabase**, per `00_brief` / `00_project-overview`). For this build the trip CTA is a **placeholder** ("Enquire about this trip") that points to the future contact/inquiry flow — **no real checkout or form yet**. That flow is its own later task.
- **Vibe slugs** — §5 slugs must match the homepage's existing `/vibe/{slug}` links exactly. The homepage is the source of truth; reconcile if they differ.
- **Coordinates / map** — not included (a map is out of scope for now). Easy to add a `coordinates` field later if we want a "where is it" map.

---

## ✅ Knowledge files to update after this chat
- **Save this file as `03_content.md`** in the Project knowledge (and drop a copy in the repo at `docs/03_content.md`).
- **Update `BUILD-STATUS.md`** at the end of the build (tick "Destinations pages" + "Tour packages pages", add a log line, bump the date) and re-upload it to the Project knowledge. *(The build prompt does this as its final step.)*
