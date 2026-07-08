<!-- VOIA PROJECT REFERENCE
     This single file contains TWO source-of-truth documents for the Voia build:
       1) DESIGN SYSTEM  - colours, typography, components, Tailwind v4 setup
       2) BRAND & BRIEF  - brand, voice, and the starter catalog
     Both are authoritative. The design system comes first; the brief is appended after the divider. -->

# 02 — Design System
*The visual source of truth for Voia. Colours, type, spacing, components, and a ready-to-paste Tailwind config. Build everything (homepage, forms, chatbot) from these tokens so the site feels like one product. Created in the "Design System" chat.*

> **How to use this file:** When building in VS Code, point `CLAUDE.md` at this doc and copy the Tailwind v4 setup + `@theme` block (§8) into `src/styles/global.css`. Use the component "class recipes" as starting points. Every colour pairing listed here has been contrast-checked against WCAG AA — see the Contrast table.

---

## Design direction (one line)
**Sunset meets sea.** A warm **coral** lead and a calm **teal** co-lead, a friendly characterful **sans** display, soft rounded cards, and a gentle **warm-paper** canvas. Approachable, mobile-first, *for everyone* — grounded in Voia's actual range, from Black Sea beaches to warm-in-winter escapes.

**Why this and not the obvious "warm travel" look:** the cliché for a brief like this is cream background + a high-contrast serif + a lone terracotta accent. We keep the warmth the brief asks for but make two deliberate moves so it doesn't read as templated: **(1)** a *friendly sans* display (Bricolage Grotesque), not a serif — it reads "warm friend / for everyone," not "exclusive editorial"; and **(2)** *teal as a true co-lead*, not a single accent — the warm/cool pairing is the identity, and it nods to sea + sky + delta.

---

## 1 · Colour palette

Voia uses four colour families plus semantic states. Each family runs `50` (lightest) → `900` (darkest), so Tailwind utilities like `bg-coral-600` / `text-teal-700` work everywhere.

### Primary — Coral (warmth, "the feeling", main CTAs)
The hero colour. Sunset/warm-stone energy. Used for primary buttons, the logo mark, key highlights.

| Token | Hex | Typical use |
|---|---|---|
| `coral-50`  | `#FFF3EE` | Tinted surfaces, soft-button background |
| `coral-100` | `#FFE3D8` | Hover for soft surfaces, subtle fills |
| `coral-200` | `#FFC3AF` | Borders on tinted areas |
| `coral-300` | `#FF9C7E` | Decorative, illustrations |
| `coral-400` | `#FA7551` | Decorative, gradients |
| `coral-500` | `#EE5A35` | **Brand mark**, focus rings, icon accents |
| `coral-600` | `#D2451F` | **Primary button** background (white text ✓) |
| `coral-700` | `#AC3717` | Button hover/active, coral **text on light** ✓ |
| `coral-800` | `#882C14` | Pressed state |
| `coral-900` | `#6A2412` | Deep accents |

### Secondary — Teal (calm, sea/sky, the co-lead)
Balances the warmth. Used for links, secondary actions, the AI-search accent, chatbot header.

| Token | Hex | Typical use |
|---|---|---|
| `teal-50`  | `#ECFAF8` | Tinted surfaces, ghost-button hover |
| `teal-100` | `#CFF1ED` | Subtle fills |
| `teal-200` | `#A2E3DC` | Borders on tinted areas |
| `teal-300` | `#69CEC5` | Decorative |
| `teal-400` | `#38B2A9` | Decorative, gradients |
| `teal-500` | `#1E9A91` | AI-search gradient start, icon accents |
| `teal-600` | `#137C74` | **Secondary button** / **link** colour (white text ✓ / on-white text ✓) |
| `teal-700` | `#11645E` | Link hover, teal **text on light** ✓ |
| `teal-800` | `#114F4B` | Pressed |
| `teal-900` | `#103F3C` | Deep accents |

### Accent — Amber (sunshine, used sparingly)
A warm pop for badges, "new/featured" flags, the small sparkle on the AI search. **Accent only — never for body text and never with white text.**

| Token | Hex | Typical use |
|---|---|---|
| `amber-50`  | `#FFF8EA` | Featured-section background |
| `amber-100` | `#FFEFC6` | Badge background (with dark text) |
| `amber-300` | `#FFC84A` | Badge / pill background (dark text ✓) |
| `amber-400` | `#FAB31E` | Highlight chip background (dark text ✓) |
| `amber-500` | `#E89A06` | Decorative, star ratings |
| `amber-700` | `#976009` | Amber **text on white** ✓ (the only safe amber-as-text) |
| `amber-800` | `#7B4D10` | Text on amber-50 ✓ |

> ⚠️ **Amber rule:** white text on amber fails contrast (≈3.5:1). Always put **dark (`ink`) text on amber backgrounds**, and only use `amber-700`+ if amber must be text on white.

### Neutrals — Sand (warm grey, text & structure)
Warm-tinted greys (not cold blue-grey) keep the whole UI friendly. `sand-900` doubles as our text colour, aliased `ink`.

| Token | Hex | Typical use |
|---|---|---|
| `sand-50`  | `#FBF8F3` | **Page background** (warm paper) |
| `sand-100` | `#F4EDE5` | Section bands, chip background, disabled fills |
| `sand-200` | `#E8DCCF` | Dividers, card borders |
| `sand-300` | `#D6C6B5` | Decorative dividers (non-essential) |
| `sand-400` | `#B9A693` | Disabled text, faint icons |
| `sand-500` | `#927F6C` | **Input borders** (3.84:1 ✓), large/decorative text only |
| `sand-600` | `#6E5C4B` | **Muted/placeholder text** on white ✓ |
| `sand-700` | `#54463A` | **Secondary text** ✓ |
| `sand-900` | `#2A201B` | **Body / heading text** = `ink` ✓ |

### Semantic — states
Reuse **amber** tokens for *warning*. For success / error / info, use these:

| State | bg (`-50`) | solid (`-600`) | text-on-light (`-700`) | Use |
|---|---|---|---|---|
| **Success** | `#E7F6EC` | `#1E854B` | `#136B3B` | Form submitted, confirmation |
| **Error** | `#FDECEA` | `#C5311F` | `#9E2417` | Invalid input, failed action |
| **Info** | `#E8F1FB` | `#1E73C8` | `#155299` | Tips, neutral notices |
| **Warning** | `amber-100 #FFEFC6` | `amber-400 #FAB31E` | `amber-800 #7B4D10` | "Heads up: August gets busy" |

**Colour roles at a glance:** Coral = *do this / brand*. Teal = *learn more / navigate*. Amber = *notice this* (rare). Sand = *everything else*.

---

## 2 · Contrast (WCAG AA — verified)
Every pairing below was computed with the WCAG relative-luminance formula. **AA needs 4.5:1** for normal text, **3:1** for large text (≥24px, or ≥18.66px bold) and for non-text UI (icons, focus rings, borders).

| Foreground → Background | Ratio | Meets |
|---|---|---|
| White → `coral-600` (primary button) | **4.55** | AA ✓ |
| White → `coral-700` (hover) | 6.34 | AA ✓ |
| `coral-700` → white (text) | 6.34 | AA ✓ |
| `coral-700` → `coral-50` (soft button) | 5.83 | AA ✓ |
| White → `teal-600` (secondary button) | 5.04 | AA ✓ |
| `teal-600` → white (link) | 5.04 | AA ✓ |
| `teal-700` → `teal-50` | 6.51 | AA ✓ |
| `ink` → white (body) | 15.90 | AAA ✓ |
| `ink` → `sand-50` (body on page) | 15.01 | AAA ✓ |
| `sand-700` → white (secondary text) | 9.07 | AAA ✓ |
| `sand-600` → white (muted / placeholder) | 6.37 | AA ✓ |
| `ink` → `amber-400` (badge) | 8.73 | AAA ✓ |
| `amber-700` → white (accent text) | 5.26 | AA ✓ |
| White → `error-600` | 5.48 | AA ✓ |
| `error-700` → `error-50` | 6.75 | AA ✓ |
| White → `success-600` | 4.65 | AA ✓ |
| White → `info-600` | 4.84 | AA ✓ |
| `coral-500` focus ring → white *(non-text)* | 3.42 | AA ✓ (3:1) |
| `sand-500` input border → white *(non-text)* | 3.84 | AA ✓ (3:1) |

**Fails to avoid (documented so nobody trips on them):** white on `amber-600` (3.49 ✗ — use dark text), `sand-500` as *normal* text (3.84 ✗ — large/decorative only), 1px `sand-300/400` input borders (<3:1 ✗ — use `sand-500` for input borders).

---

## 3 · Typography

Two Google Fonts, both variable, both free.

- **Display — Bricolage Grotesque.** Friendly and characterful without being loud; gives headings personality that says "well-travelled friend," not "luxury editorial." Used for h1–h3, hero, and card titles.
- **Body / UI — Plus Jakarta Sans.** A humanist geometric sans with excellent small-size legibility — ideal for mobile body text, buttons, inputs, and labels.

**Fallback stacks**
```
Display: "Bricolage Grotesque", "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif
Body:    "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif
```

**Load the fonts** — paste into your Astro base layout `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Plus+Jakarta+Sans:wght@400..700&display=swap">
```

### Type scale (mobile-first)
Base is **16px**. Values are `rem` / `px` with a sensible line-height. The big sizes (`4xl`+) are written for mobile; bump headings up on `md:`/`lg:` where noted.

| Token | Size (rem / px) | Line-height | Font | Used for |
|---|---|---|---|---|
| `xs`   | 0.75 / 12  | 1rem    | Body | Captions, overlines, badges |
| `sm`   | 0.875 / 14 | 1.25rem | Body | Helper text, small UI, chips |
| `base` | 1 / 16     | 1.5rem  | Body | Body copy (default) |
| `lg`   | 1.125 / 18 | 1.75rem | Body | Lead paragraph, intro |
| `xl`   | 1.25 / 20  | 1.75rem | Display | Vibe-card titles, h4 |
| `2xl`  | 1.5 / 24   | 2rem    | Display | h3 |
| `3xl`  | 1.875 / 30 | 2.25rem | Display | h2 (mobile) → `4xl` on `md:` |
| `4xl`  | 2.25 / 36  | 2.5rem  | Display | h1 (mobile) → `5xl`/`6xl` on `md:` |
| `5xl`  | 3 / 48     | 1.1     | Display | Hero headline (tablet+) |
| `6xl`  | 3.75 / 60  | 1.05    | Display | Hero headline (desktop) |

**Weights**
- *Bricolage Grotesque (display):* 600 for most headings, **700–800** for the hero. Avoid sub-500 for headings.
- *Plus Jakarta Sans (body):* **400** body, **500** medium UI, **600** semibold (buttons, emphasis), **700** strong.

**Defaults:** body text `text-base text-ink` with `leading-relaxed` for paragraphs; headings get `font-display tracking-tight`. Keep line length ~60–75 characters (`max-w-prose`).

---

## 4 · Spacing scale

A **4px base** (matches Tailwind's built-in scale, so every standard utility applies). Use these steps for rhythm:

| Token | px | rem | Common use |
|---|---|---|---|
| `1` | 4   | 0.25  | Icon gaps, hairline insets |
| `2` | 8   | 0.5   | Tight gaps, chip padding |
| `3` | 12  | 0.75  | Input padding (Y), small gaps |
| `4` | 16  | 1     | Default gap, card padding (mobile) |
| `5` | 20  | 1.25  | Button padding (X) |
| `6` | 24  | 1.5   | Card padding, section inner |
| `8` | 32  | 2     | Block spacing |
| `12`| 48  | 3     | Section spacing (mobile) |
| `16`| 64  | 4     | Section spacing (tablet) |
| `24`| 96  | 6     | Section spacing (desktop) |

Tailwind v4 generates spacing **dynamically**, so finer steps like `p-4.5` (18px), `mt-13` (52px), `h-15` / `h-18` / `h-22` all work with no config at all. **Tap-target note:** `min-h-11` = 44px is our minimum for tappable controls.

---

## 5 · Border radius
Slightly generous radii give the friendly, soft feel. These **override** Tailwind's defaults (set via `--radius-*` in the `@theme` block).

| Token | Value | Use |
|---|---|---|
| `rounded-sm`  | 6px  | Chips, small tags |
| `rounded-md`  | 10px | Inputs, small buttons |
| `rounded-lg`  | 14px | Buttons, inputs (default) |
| `rounded-xl`  | 20px | Small cards, popovers |
| `rounded-2xl` | 28px | **Vibe cards**, AI-search box, chatbot panel, modals |
| `rounded-3xl` | 36px | Large hero surfaces |
| `rounded-full`| pill | Chips, FAB, avatars, example-prompt buttons |

---

## 6 · Shadows
Warm-tinted (brown-based rgba, not grey) so shadows feel part of the palette. From subtle to prominent.

| Token | Use |
|---|---|
| `shadow-xs`   | Faint lift on small elements |
| `shadow-sm`   | Inputs, chips on hover |
| `shadow-card` | **Vibe cards at rest** |
| `shadow-md`   | AI-search box, raised cards, popovers |
| `shadow-lg`   | Chatbot panel, modals, the floating chat button |

Exact values are in the `@theme` block (§8). Keep elevation meaningful — most surfaces sit flat on the warm page; reserve `shadow-lg` for things that truly float.

---

## 7 · Core components

Each component lists the **look** plus a **Tailwind class recipe** to start from. Recipes assume the config below and the `lucide` icon set (see gaps).

### 7.1 · Vibe cards (the 8 categories)
The heart of the homepage: eight tappable cards mapping 1:1 to the homepage vibe categories.

**Look:** portrait card, photo background with a warm dark gradient scrim at the bottom for guaranteed text legibility, a line-icon in a frosted circle top-left, the category name (display font) bottom-left, optional one-line teaser. The **whole card is the link** (big tap target). Hover/press lifts gently; clear keyboard focus.

**Grid:** 2 columns on mobile → 3 on `sm:` → 4 on `lg:`, gap `4`.

**The 8 categories** (icon = lucide name; teaser = placeholder copy in Voia's voice — edit freely):

| # | Category | Icon (`lucide`) | Teaser (placeholder) |
|---|---|---|---|
| 1 | Beach | `Umbrella` | "Sand, sea, and slow days." |
| 2 | Mountain | `Mountain` | "Peaks, trails, and fresh air." |
| 3 | City Break | `Building-2` | "Cafés, streets, and good chaos." |
| 4 | Historical Monuments | `Landmark` | "Castles, ruins, and old stories." |
| 5 | Tourist Attractions | `Camera` | "The big sights, worth the trip." |
| 6 | Nature & Landscapes | `Trees` | "Forests, deltas, and big views." |
| 7 | Adventure | `Compass` | "A little adrenaline, a lot of yes." |
| 8 | Relaxation & Wellness | `Flower-2` | "Spa days and deep exhales." |

**Recipe — photo card:**
```html
<a href="/vibe/beach"
   class="group relative block aspect-[4/5] overflow-hidden rounded-2xl shadow-card
          transition duration-200 hover:-translate-y-0.5 hover:shadow-md
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
  <img src="/img/beach.jpg" alt="" class="absolute inset-0 h-full w-full object-cover" />
  <!-- scrim guarantees title legibility over any photo -->
  <div class="absolute inset-0 bg-linear-to-t from-black/65 via-black/15 to-transparent"></div>
  <span class="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/20 backdrop-blur-sm text-white">
    <!-- <Umbrella class="h-5 w-5" /> -->
  </span>
  <div class="absolute inset-x-3 bottom-3 text-white">
    <h3 class="font-display text-xl font-semibold tracking-tight">Beach</h3>
    <p class="text-sm text-white/85">Sand, sea, and slow days.</p>
  </div>
</a>
```

**Recipe — no-photo fallback** (use until licensed imagery exists; guaranteed AA):
```html
<a href="/vibe/beach"
   class="group flex aspect-[4/5] flex-col justify-between rounded-2xl bg-coral-50 p-4 shadow-card
          transition duration-200 hover:-translate-y-0.5 hover:shadow-md
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 focus-visible:ring-offset-2">
  <span class="grid h-10 w-10 place-items-center rounded-full bg-white text-coral-600">
    <!-- <Umbrella class="h-5 w-5" /> -->
  </span>
  <div>
    <h3 class="font-display text-xl font-semibold tracking-tight text-coral-900">Beach</h3>
    <p class="text-sm text-coral-700">Sand, sea, and slow days.</p>
  </div>
</a>
```
> Tip: rotate the fallback tint across families (`coral-50`, `teal-50`, `amber-50`, `sand-100`) so the eight cards feel varied but on-brand.

### 7.2 · AI custom-search box (the signature element)
The prominent hero input: *"Not sure where? Just describe the vibe."* The **teal→coral gradient hairline border** is the signal that this is the smart/AI search — the one memorable Voia detail.

**Look:** white surface, `rounded-2xl`, `shadow-md`, wrapped in a 1.5px teal-to-coral gradient border. A `Sparkles` icon (teal) leads, a large borderless text input in the middle, a coral "Find my trip" button on the right. Example-prompt chips sit below and pre-fill the input. Focus lights up the whole box.

**Recipe:**
```html
<div class="rounded-[28px] bg-linear-to-r from-teal-500 to-coral-500 p-[1.5px] shadow-md
            focus-within:ring-2 focus-within:ring-coral-500 focus-within:ring-offset-2">
  <div class="flex items-center gap-2 rounded-[26px] bg-white p-2 pl-4">
    <!-- <Sparkles class="h-5 w-5 text-teal-600 shrink-0" /> -->
    <input type="text"
      class="min-h-11 w-full bg-transparent text-base text-ink placeholder:text-sand-600 focus:outline-none"
      placeholder="Warm in winter · somewhere like Santorini · mountains and quiet…" />
    <button class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-coral-600 px-5
                   font-semibold text-white transition-colors hover:bg-coral-700
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 focus-visible:ring-offset-2">
      Find my trip
    </button>
  </div>
</div>

<!-- example prompt chips -->
<div class="mt-3 flex flex-wrap gap-2">
  <button class="min-h-10 rounded-full bg-sand-100 px-4 text-sm text-sand-700 transition-colors hover:bg-sand-200">Warm in winter</button>
  <button class="min-h-10 rounded-full bg-sand-100 px-4 text-sm text-sand-700 transition-colors hover:bg-sand-200">Somewhere like Santorini</button>
  <button class="min-h-10 rounded-full bg-sand-100 px-4 text-sm text-sand-700 transition-colors hover:bg-sand-200">Mountains &amp; quiet</button>
</div>
```
> On mobile the button can collapse to an arrow icon (`ArrowRight`) to save width — keep its tap target at 44px.

### 7.3 · Buttons

**Primary** — main CTA (book, search, submit):
```
inline-flex items-center justify-center gap-2 min-h-11 px-5 rounded-lg
bg-coral-600 text-white font-semibold tracking-tight
hover:bg-coral-700 active:bg-coral-800
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 focus-visible:ring-offset-2
disabled:opacity-50 disabled:pointer-events-none transition-colors
```

**Secondary** — "learn more", alternative action (outlined teal):
```
inline-flex items-center justify-center gap-2 min-h-11 px-5 rounded-lg
bg-white text-teal-700 font-semibold ring-1 ring-teal-600
hover:bg-teal-50 active:bg-teal-100
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 transition-colors
```

**Soft / tonal** — low-emphasis on warm surfaces:
```
… bg-coral-50 text-coral-700 hover:bg-coral-100 …
```

**Ghost / text** — tertiary, inline:
```
… bg-transparent text-teal-700 hover:bg-teal-50 px-3 …
```

**Sizes:** `sm` = `min-h-9 px-3 text-sm` (dense UI only), `md` = `min-h-11 px-5` (default), `lg` = `min-h-12 px-6 text-lg`. **Primary CTAs use `md`/`lg`** (≥44px tall).

### 7.4 · Form inputs

**Look:** white fill, `sand-500` border (meets the 3:1 non-text threshold), `rounded-lg`, comfortable padding, ≥44px tall. Label above, helper below. Focus = coral border + coral ring. Errors show a **message and icon**, never colour alone.

**Recipe — text field:**
```html
<label for="email" class="block text-sm font-medium text-sand-700 mb-1.5">Email</label>
<input id="email" type="email"
  class="w-full min-h-11 rounded-lg border border-sand-500 bg-white px-3.5 text-base text-ink
         placeholder:text-sand-600 transition
         focus:border-coral-500 focus:outline-none focus:ring-2 focus:ring-coral-500/40" />
<p class="mt-1.5 text-sm text-sand-600">We'll only use this to send your trip details.</p>
```

**Error state:** swap to `border-error-600 focus:border-error-600 focus:ring-error-600/40`, and make the helper `text-error-700` with a leading `AlertCircle` icon. Add `aria-invalid="true"` and `aria-describedby` pointing at the message.

**Disabled:** `bg-sand-100 text-sand-500 cursor-not-allowed`. **Textareas / selects** use the same border, radius, focus, and min-height rules.

### 7.5 · Chatbot bubble + panel
The Voia concierge. Greeting in voice: *"Hi! I'm your Voia guide. What kind of trip are you in the mood for?"*

**Floating button (FAB):** fixed bottom-right, 56px coral circle, `MessageCircle` icon, `shadow-lg`. Optional amber unread dot.
```
fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full
bg-coral-600 text-white shadow-lg hover:bg-coral-700
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 focus-visible:ring-offset-2
```

**Panel (open):** rounded card that floats above the FAB; near-full-width on mobile.
```
fixed bottom-24 right-5 z-50 flex w-[min(92vw,380px)] h-[min(70vh,560px)]
flex-col overflow-hidden rounded-2xl bg-white shadow-lg
```
- **Header:** `bg-teal-600 text-white` strip with a small avatar, "Voia guide", and a close button (`X`, 44px tap target).
- **Messages area:** `flex-1 overflow-y-auto bg-sand-50 p-4 space-y-3`.
- **Bot bubble:** `max-w-[80%] rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-ink shadow-sm`.
- **User bubble:** `ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-coral-600 px-3.5 py-2.5 text-white`.
- **Input row:** bottom bar with a text input (rules from 7.4) + coral send button (`min-h-11`).
- **A11y:** `role="dialog"`, `aria-label="Voia guide chat"`, focus moves into the panel on open, `Esc` closes, FAB has `aria-expanded`.

> Reminder for the build: the chatbot answers are grounded in our catalog and the **API key stays server-side** (per `00_project-overview`). This doc only covers its *appearance*.

---

## 8 · Tailwind setup & theme (v4 — ready to paste)

You're on **Tailwind v4**, the current major version. This is a big change from older tutorials: **there is no `tailwind.config.js`.** Your whole theme lives in a CSS file inside an `@theme` block, and Tailwind plugs into Astro through a Vite plugin. If a guide tells you to `npm install @astrojs/tailwind` or edit `tailwind.config.mjs`, that's the old v3 way — skip it.

### Step 1 — install
The one-command way (Astro 5.2+ installs the plugin, wires it up, and creates `src/styles/global.css` for you):
```bash
npx astro add tailwind
```
…or manually:
```bash
npm install tailwindcss @tailwindcss/vite
```

### Step 2 — register the Vite plugin
In `astro.config.mjs`, the plugin goes under `vite.plugins` (not the `integrations` array):
```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: { plugins: [tailwindcss()] },
});
```

### Step 3 — paste the Voia theme
This **is** the config. Put it in `src/styles/global.css`. The `@theme` block defines every Voia token; the standard spacing scale, the type scale, and breakpoints are built into v4, so it stays short.

```css
@import "tailwindcss";

@theme {
  /* ---- Brand colours (each generates bg-/text-/border-/ring- utilities) ---- */
  --color-ink: #2A201B;

  --color-coral-50:  #FFF3EE;
  --color-coral-100: #FFE3D8;
  --color-coral-200: #FFC3AF;
  --color-coral-300: #FF9C7E;
  --color-coral-400: #FA7551;
  --color-coral-500: #EE5A35;
  --color-coral-600: #D2451F;
  --color-coral-700: #AC3717;
  --color-coral-800: #882C14;
  --color-coral-900: #6A2412;

  --color-teal-50:  #ECFAF8;
  --color-teal-100: #CFF1ED;
  --color-teal-200: #A2E3DC;
  --color-teal-300: #69CEC5;
  --color-teal-400: #38B2A9;
  --color-teal-500: #1E9A91;
  --color-teal-600: #137C74;
  --color-teal-700: #11645E;
  --color-teal-800: #114F4B;
  --color-teal-900: #103F3C;

  --color-amber-50:  #FFF8EA;
  --color-amber-100: #FFEFC6;
  --color-amber-200: #FFDD88;
  --color-amber-300: #FFC84A;
  --color-amber-400: #FAB31E;
  --color-amber-500: #E89A06;
  --color-amber-600: #BE7B04;
  --color-amber-700: #976009;
  --color-amber-800: #7B4D10;
  --color-amber-900: #684010;

  --color-sand-50:  #FBF8F3;
  --color-sand-100: #F4EDE5;
  --color-sand-200: #E8DCCF;
  --color-sand-300: #D6C6B5;
  --color-sand-400: #B9A693;
  --color-sand-500: #927F6C;
  --color-sand-600: #6E5C4B;
  --color-sand-700: #54463A;
  --color-sand-800: #3B3128;
  --color-sand-900: #2A201B;

  --color-success-50:  #E7F6EC;
  --color-success-500: #23A05A;
  --color-success-600: #1E854B;
  --color-success-700: #136B3B;

  --color-error-50:  #FDECEA;
  --color-error-500: #E0412C;
  --color-error-600: #C5311F;
  --color-error-700: #9E2417;

  --color-info-50:  #E8F1FB;
  --color-info-500: #2E86DD;
  --color-info-600: #1E73C8;
  --color-info-700: #155299;
  /* 'warning' reuses the amber-* scale above */

  /* ---- Fonts (generate font-display / font-sans) ---- */
  --font-display: "Bricolage Grotesque", "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
  --font-sans: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  /* ---- Radii (override v4 defaults) ---- */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 20px;
  --radius-2xl: 28px;
  --radius-3xl: 36px;

  /* ---- Warm-tinted shadows ---- */
  --shadow-xs:   0 1px 2px 0 rgba(60,39,25,0.06);
  --shadow-sm:   0 1px 3px 0 rgba(60,39,25,0.08), 0 1px 2px -1px rgba(60,39,25,0.08);
  --shadow-card: 0 2px 8px -2px rgba(60,39,25,0.10), 0 4px 16px -4px rgba(60,39,25,0.08);
  --shadow-md:   0 4px 12px -2px rgba(60,39,25,0.12);
  --shadow-lg:   0 12px 28px -6px rgba(60,39,25,0.16);
}

/* Page defaults: warm-paper background, ink text, friendly fonts */
@layer base {
  body { @apply bg-sand-50 text-ink font-sans antialiased; }
  h1, h2, h3 { @apply font-display tracking-tight; }
}
```

### Step 4 — load it once
Import the stylesheet in your base layout so every page picks it up:
```astro
---
// src/layouts/BaseLayout.astro
import "../styles/global.css";
---
<slot />
```

That's the whole setup — no `content` array to maintain (v4 auto-detects your files), and the type scale (`text-sm` … `text-6xl`) and spacing steps (`min-h-11`, `p-4.5`, etc.) from §3–§4 are built in, so they work without extra config.

> **One Astro gotcha:** if you use `@apply` inside a *scoped* `<style>` block in an `.astro` component (not `global.css`), add `@reference "../styles/global.css";` at the top of that block, or the build won't find the tokens. Normal class usage (`class="bg-coral-600"`) never hits this.

> *(Need a v3 `tailwind.config.js` version someday? The token values are identical — just ask and I'll generate the `theme.extend` block.)*

---

## 9 · Accessibility checklist
Pin this to the build. Everything here is achievable with the tokens above.

- **Contrast:** use only the pairings in §2. Body text is `ink`; secondary text `sand-700`; muted/placeholder `sand-600`. **Amber = dark text only.** `sand-500` is never normal-size text.
- **Focus:** every interactive element shows a visible `focus-visible` ring — `ring-2 ring-coral-500 ring-offset-2` (≈3.4:1 vs white, meets the 3:1 non-text rule). Never `outline-none` without a replacement ring.
- **Tap targets:** minimum **44×44px** for tappable controls (`min-h-11`); FAB is 56px; chips ≥40px with spacing. (Comfortably above the WCAG 2.5.8 AA floor of 24px.) The whole vibe card is one big target.
- **Don't rely on colour alone:** vibe cards pair an icon **and** a label; form errors show a message **and** an icon; links are a distinct colour **and** get an underline on hover/focus.
- **Motion:** keep transitions subtle (150–200ms) and wrap movement in `motion-reduce:` resets so `prefers-reduced-motion` users get no translate/scale.
- **Forms:** every input has a real `<label>`; errors use `aria-invalid` + `aria-describedby`; "required" is shown in text, not just a colour or asterisk.
- **Spacing:** ≥8–12px gap between adjacent tappable cards so fingers don't mis-hit.
- **Images:** decorative vibe-card photos use `alt=""`; content images get descriptive alt text.

---

## 10 · Gaps & decisions to confirm
Per the project rule (*never invent facts; flag gaps*), these are open choices, not settled facts:

1. **Tailwind version** — ✅ **Resolved: Tailwind v4** (CSS-first). The config is a CSS `@theme` block, not a JS file (§8). *(If you ever need a v3 `tailwind.config.js`, the token values are identical.)*
2. **Icon set** — recipes assume **Lucide** (free, clean, friendly, available in Astro via `astro-icon` or inline SVG). Confirm before building. *(Design choice.)*
3. **Brand colours weren't specified in the brief** — this palette is a *proposal*. Treat this file as where they're now locked, but you're free to nudge hexes.
4. **Fonts are a design choice, not a brand fact** — Bricolage Grotesque + Plus Jakarta Sans. If you'd prefer a single uniform sans or a different pairing, it's a 2-line swap.
5. **Imagery** — vibe cards and destinations still need **properly licensed photos** (already flagged in `00_brief`). Until then, ship the **no-photo card variant** (§7.1).

---

## ✅ Knowledge file to update
- **Save this document as `02_design-system.md`** in your Project knowledge base. *(That's the only file this task changes — `00_brief` and `00_project-overview` already list `02_design-system`, so no edits needed there.)*
- *Optional:* add a one-line entry to `07_changelog`, e.g. *"Added 02_design-system — palette (coral/teal/amber/sand, AA-verified), Bricolage + Jakarta type, components, Tailwind v4 `@theme` config."*

**Suggested next chat:** the **Homepage / Vacation Selector build** — turn the 8 vibe cards + the AI custom-search box into the real Astro page using these exact tokens.



---
---

# ============================================================
#   PART 2 - BRAND & BRIEF  (appended for reference)
# ============================================================

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
- **Affiliate vs direct booking** — since we're "both," we'll define in `01_architecture` whether bookings are handled in-house (inquiry → Supabase) or via affiliate links.

---

## Suggested next steps (one task per chat)
1. **Design system** (`02_design-system`) — colours, type, and the look of the vibe cards, so the homepage build has a style to follow.
2. **Homepage / Vacation Selector build** — turn the 8 categories + custom search into the real Astro page.
3. **Content modelling** (`03_content`) — define the destination & package fields, then enter this catalog as structured data.

Tell me which one you'd like to tackle next and I'll set it up.
