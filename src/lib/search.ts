// Voia smart search — dependency-free, client-side natural-language search
// over the (tiny) destinations + packages catalog.
//
// Pure module: no Astro imports, erasable-types-only TypeScript, so it can
// run directly under `node --experimental-strip-types` (see test/search.test.ts)
// as well as bundled into the browser via Vite/Astro.

export type Region = "romania" | "international";

export interface DestinationItem {
  kind: "destination";
  slug: string;
  title: string;
  country: string;
  city?: string;
  region: Region;
  vibes: string[];
  activities: string[];
  seasonMonths: number[];
  tagline: string;
  bestFor: string[];
}

export interface PackageItem {
  kind: "package";
  slug: string;
  title: string;
  vibes: string[];
  activities: string[];
  seasonMonths: number[];
  durationDays: number;
  priceFrom: number;
  priceTo: number;
  currency: string;
  tagline: string;
  greatFor: string[];
  countries: string[];
  cities: string[];
}

export type CatalogItem = DestinationItem | PackageItem;

export interface Facets {
  vibes: string[];
  priceMax?: number;
  priceMin?: number;
  durationMin?: number;
  durationMax?: number;
  months: number[];
  people?: number;
  countryOrCity: string[];
  freeText: string[];
}

export interface RankedResult {
  item: CatalogItem;
  score: number;
}

export interface SearchResult {
  results: RankedResult[];
  facets: Facets;
}

interface IndexedItem {
  item: CatalogItem;
  haystack: string;
  vibesSet: Set<string>;
}

interface Place {
  normalized: string;
  display: string;
}

export interface SearchIndex {
  items: IndexedItem[];
  places: Place[];
}

// ---------------------------------------------------------------------------
// Normalization + fuzzy matching
// ---------------------------------------------------------------------------

function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[] = new Array(n + 1);
  for (let j = 0; j <= n; j += 1) dp[j] = j;
  for (let i = 1; i <= m; i += 1) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j += 1) {
      const temp = dp[j];
      dp[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[j], dp[j - 1]);
      prev = temp;
    }
  }
  return dp[n];
}

// True if `word` and `needle` are close enough to count as the "same" word:
// exact substring, shared 4-letter prefix (handles plurals like
// family/families), or a small edit distance (handles typos).
function fuzzyIncludes(word: string, needle: string): boolean {
  if (word.length < 2 || needle.length < 2) return false;
  if (word.includes(needle) || needle.includes(word)) return true;
  if (word.length >= 4 && needle.length >= 4 && word.slice(0, 4) === needle.slice(0, 4)) return true;
  const maxLen = Math.max(word.length, needle.length);
  if (maxLen < 4) return false;
  const threshold = maxLen <= 6 ? 1 : 2;
  return levenshtein(word, needle) <= threshold;
}

// ---------------------------------------------------------------------------
// Vibe synonym map
// ---------------------------------------------------------------------------

const VIBE_SYNONYMS: Record<string, string[]> = {
  beach: ["beach", "beaches", "seaside", "coast", "coastal"],
  mountain: ["mountain", "mountains", "hiking", "hike", "alps", "alpine"],
  "city-break": ["city break", "city-break", "citybreak", "city", "cities", "urban"],
  "historical-monuments": [
    "history",
    "historic",
    "historical",
    "monument",
    "monuments",
    "ruins",
    "castle",
    "castles",
  ],
  "tourist-attractions": [
    "sightseeing",
    "landmark",
    "landmarks",
    "attraction",
    "attractions",
    "sights",
    "sight",
  ],
  "nature-landscapes": [
    "nature",
    "landscape",
    "landscapes",
    "wildlife",
    "forest",
    "forests",
    "wetland",
    "wetlands",
  ],
  adventure: ["adventure", "adventurous", "adrenaline"],
  "relaxation-wellness": [
    "relax",
    "relaxation",
    "wellness",
    "spa",
    "honeymoon",
    "romantic",
    "romance",
  ],
};

const SINGLE_WORD_VIBE_SYNONYMS: { word: string; vibe: string }[] = [];
for (const [vibe, words] of Object.entries(VIBE_SYNONYMS)) {
  for (const word of words) {
    if (!word.includes(" ")) SINGLE_WORD_VIBE_SYNONYMS.push({ word, vibe });
  }
}

const MONTHS: Record<string, number> = {
  january: 1, jan: 1,
  february: 2, feb: 2,
  march: 3, mar: 3,
  april: 4, apr: 4,
  may: 5,
  june: 6, jun: 6,
  july: 7, jul: 7,
  august: 8, aug: 8,
  september: 9, sep: 9, sept: 9,
  october: 10, oct: 10,
  november: 11, nov: 11,
  december: 12, dec: 12,
};

const STOPWORDS = new Set([
  "a", "an", "the", "in", "for", "to", "with", "and", "of", "or",
  "some", "somewhere", "someplace", "trip", "vacation", "holiday",
  "want", "looking", "look", "like", "me", "find", "my", "please",
  "need", "go", "going", "visit", "place", "spot", "is", "are",
]);

// ---------------------------------------------------------------------------
// Index building
// ---------------------------------------------------------------------------

function placesOf(item: CatalogItem): string[] {
  if (item.kind === "destination") {
    return [item.country, ...(item.city ? [item.city] : [])];
  }
  return [...item.countries, ...item.cities];
}

function buildHaystack(item: CatalogItem): string {
  const parts: string[] = [
    item.title,
    item.tagline,
    ...item.vibes.map((v) => v.replace(/-/g, " ")),
    ...item.activities,
    ...placesOf(item),
  ];
  if (item.kind === "destination") {
    parts.push(item.region === "romania" ? "romania" : "international", ...item.bestFor);
  } else {
    parts.push(`${item.durationDays} days`, ...item.greatFor);
  }
  return normalize(parts.join(" "));
}

export function buildIndex(items: CatalogItem[]): SearchIndex {
  const placeMap = new Map<string, string>();
  for (const item of items) {
    for (const place of placesOf(item)) {
      const key = normalize(place);
      if (key) placeMap.set(key, place);
    }
  }

  return {
    items: items.map((item) => ({
      item,
      haystack: buildHaystack(item),
      vibesSet: new Set(item.vibes),
    })),
    places: [...placeMap.entries()].map(([normalized, display]) => ({ normalized, display })),
  };
}

// ---------------------------------------------------------------------------
// Query parsing
// ---------------------------------------------------------------------------

function findPlace(token: string, places: Place[]): string | undefined {
  for (const place of places) {
    if (place.normalized === token) return place.display;
  }
  for (const place of places) {
    if (fuzzyIncludes(place.normalized, token)) return place.display;
  }
  return undefined;
}

function parseQuery(query: string, places: Place[]): { facets: Facets; freeTextTokens: string[] } {
  let remaining = normalize(query);
  const facets: Facets = { vibes: [], months: [], countryOrCity: [], freeText: [] };

  // --- price ---
  const under = remaining.match(/(?:under|below|less than|<)\s*€?\s*(\d{2,6})/);
  if (under) {
    facets.priceMax = Number(under[1]);
    remaining = remaining.replace(under[0], " ");
  }
  const over = remaining.match(/(?:over|above|more than|>)\s*€?\s*(\d{2,6})/);
  if (over) {
    facets.priceMin = Number(over[1]);
    remaining = remaining.replace(over[0], " ");
  }
  if (/\b(budget|cheap|affordable)\b/.test(remaining)) {
    facets.priceMax = facets.priceMax ?? 700;
    remaining = remaining.replace(/\b(budget|cheap|affordable)\b/g, " ");
  }
  if (/\b(luxury|premium|splurge)\b/.test(remaining)) {
    facets.priceMin = facets.priceMin ?? 1000;
    remaining = remaining.replace(/\b(luxury|premium|splurge)\b/g, " ");
  }

  // --- duration ---
  const days = remaining.match(/(\d{1,2})\s*[- ]?\s*day/);
  if (days) {
    const n = Number(days[1]);
    facets.durationMin = Math.max(1, n - 1);
    facets.durationMax = n + 1;
    remaining = remaining.replace(days[0], " ");
  }
  if (/\b(a week|week[- ]?long)\b/.test(remaining)) {
    facets.durationMin = facets.durationMin ?? 6;
    facets.durationMax = facets.durationMax ?? 8;
    remaining = remaining.replace(/\b(a week|week[- ]?long)\b/g, " ");
  }
  if (/\bweekend\b/.test(remaining)) {
    facets.durationMin = facets.durationMin ?? 2;
    facets.durationMax = facets.durationMax ?? 3;
    remaining = remaining.replace(/\bweekend\b/g, " ");
  }

  // --- people ---
  const people = remaining.match(/(\d{1,2})\s*(?:people|persons|travellers|travelers)/);
  if (people) {
    facets.people = Number(people[1]);
    remaining = remaining.replace(people[0], " ");
  }
  if (/\bfor two\b/.test(remaining)) {
    facets.people = facets.people ?? 2;
    remaining = remaining.replace(/\bfor two\b/g, " ");
  }

  // --- months / seasons ---
  for (const [name, num] of Object.entries(MONTHS)) {
    const re = new RegExp(`\\b${name}\\b`);
    if (re.test(remaining)) {
      facets.months.push(num);
      remaining = remaining.replace(re, " ");
    }
  }
  if (/\bwinter\b/.test(remaining)) {
    facets.months.push(12, 1, 2);
    remaining = remaining.replace(/\bwinter\b/g, " ");
  }
  if (/\bspring\b/.test(remaining)) {
    facets.months.push(3, 4, 5);
    remaining = remaining.replace(/\bspring\b/g, " ");
  }
  if (/\bsummer\b/.test(remaining)) {
    facets.months.push(6, 7, 8);
    remaining = remaining.replace(/\bsummer\b/g, " ");
  }
  if (/\b(autumn|fall)\b/.test(remaining)) {
    facets.months.push(9, 10, 11);
    remaining = remaining.replace(/\b(autumn|fall)\b/g, " ");
  }
  facets.months = [...new Set(facets.months)];

  // --- vibes (phrase-level, exact) ---
  for (const [vibe, synonyms] of Object.entries(VIBE_SYNONYMS)) {
    for (const syn of synonyms) {
      if (!syn.includes(" ")) continue; // single-word handled in the token pass below
      const re = new RegExp(`\\b${escapeRegex(syn)}\\b`);
      if (re.test(remaining)) {
        if (!facets.vibes.includes(vibe)) facets.vibes.push(vibe);
        remaining = remaining.replace(re, " ");
      }
    }
  }

  // --- tokenize what's left: single-word vibes (exact + fuzzy), places, free text ---
  const tokens = remaining.split(/[^a-z0-9]+/).filter((t) => t.length > 0 && !STOPWORDS.has(t));
  const freeTextTokens: string[] = [];

  for (const token of tokens) {
    const exactVibe = SINGLE_WORD_VIBE_SYNONYMS.find((s) => s.word === token);
    if (exactVibe) {
      if (!facets.vibes.includes(exactVibe.vibe)) facets.vibes.push(exactVibe.vibe);
      continue;
    }
    const fuzzyVibe = SINGLE_WORD_VIBE_SYNONYMS.find((s) => fuzzyIncludes(s.word, token));
    if (fuzzyVibe) {
      if (!facets.vibes.includes(fuzzyVibe.vibe)) facets.vibes.push(fuzzyVibe.vibe);
      continue;
    }
    const place = findPlace(token, places);
    if (place) {
      if (!facets.countryOrCity.includes(place)) facets.countryOrCity.push(place);
      continue;
    }
    freeTextTokens.push(token);
  }

  facets.freeText = freeTextTokens;
  return { facets, freeTextTokens };
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

function scoreItem(indexed: IndexedItem, facets: Facets, freeTextTokens: string[]): number {
  const item = indexed.item;
  let score = 0;
  let matched = false;

  if (facets.countryOrCity.length > 0) {
    const itemPlaces = normalize(placesOf(item).join(" "));
    for (const place of facets.countryOrCity) {
      if (itemPlaces.includes(normalize(place))) {
        score += 5;
        matched = true;
      }
    }
  }

  for (const vibe of facets.vibes) {
    if (indexed.vibesSet.has(vibe)) {
      score += 3;
      matched = true;
    }
  }

  if (facets.months.length > 0 && item.seasonMonths.length > 0) {
    const overlap = facets.months.filter((m) => item.seasonMonths.includes(m));
    if (overlap.length > 0) {
      score += 2 * (overlap.length / facets.months.length);
      matched = true;
    }
  }

  if (item.kind === "package") {
    if (facets.priceMax !== undefined) {
      if (item.priceFrom <= facets.priceMax) {
        score += 2;
        matched = true;
      } else {
        score -= 1;
      }
    }
    if (facets.priceMin !== undefined) {
      if (item.priceTo >= facets.priceMin) {
        score += 2;
        matched = true;
      } else {
        score -= 1;
      }
    }
    if (facets.durationMin !== undefined || facets.durationMax !== undefined) {
      const min = facets.durationMin ?? 0;
      const max = facets.durationMax ?? Number.POSITIVE_INFINITY;
      if (item.durationDays >= min && item.durationDays <= max) {
        score += 2;
        matched = true;
      }
    }
  }

  const activityHaystack = normalize(item.activities.join(" "));
  for (const token of freeTextTokens) {
    if (token.length >= 3 && activityHaystack.includes(token)) {
      score += 1.5;
      matched = true;
    }
  }

  const haystackWords = indexed.haystack.split(/\s+/);
  for (const token of freeTextTokens) {
    if (token.length < 3) continue;
    if (indexed.haystack.includes(token)) {
      score += 1;
      matched = true;
      continue;
    }
    if (haystackWords.some((w) => fuzzyIncludes(w, token))) {
      score += 0.6;
      matched = true;
    }
  }

  return matched ? score : 0;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function search(query: string, index: SearchIndex): SearchResult {
  const { facets, freeTextTokens } = parseQuery(query, index.places);

  const results = index.items
    .map((indexed) => ({ item: indexed.item, score: scoreItem(indexed, facets, freeTextTokens) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  return { results, facets };
}
