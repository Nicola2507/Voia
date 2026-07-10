import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildIndex, search, type CatalogItem } from "../src/lib/search.ts";

// A small fixture mirroring the shape of the real catalog (8 destinations +
// 6 packages) closely enough to exercise every facet the parser supports.
const CATALOG: CatalogItem[] = [
  {
    kind: "destination",
    slug: "santorini",
    title: "Santorini",
    country: "Greece",
    city: "Fira",
    region: "international",
    vibes: ["beach", "relaxation-wellness", "tourist-attractions"],
    activities: ["Beaches", "Sunsets", "Wine tasting", "Village wandering"],
    seasonMonths: [5, 6, 7, 8, 9, 10],
    tagline: "The white-and-blue one — and yes, those sunsets.",
    bestFor: ["Couples", "A romantic milestone"],
  },
  {
    kind: "destination",
    slug: "rome",
    title: "Rome",
    country: "Italy",
    city: "Rome",
    region: "international",
    vibes: ["city-break", "historical-monuments", "tourist-attractions"],
    activities: ["Sightseeing", "Museums", "Food tours", "Ancient history"],
    seasonMonths: [3, 4, 5, 9, 10, 11],
    tagline: "The history heavyweight.",
    bestFor: ["City lovers", "Culture seekers"],
  },
  {
    kind: "destination",
    slug: "bali",
    title: "Bali",
    country: "Indonesia",
    city: "Ubud",
    region: "international",
    vibes: ["beach", "relaxation-wellness", "nature-landscapes", "adventure"],
    activities: ["Beaches", "Surfing", "Yoga & wellness", "Volcano hikes", "Temples", "Rice terraces"],
    seasonMonths: [4, 5, 6, 7, 8, 9, 10],
    tagline: "The flagship warm-in-winter escape.",
    bestFor: ["Wellness travellers"],
  },
  {
    kind: "destination",
    slug: "black-sea-coast",
    title: "Black Sea Coast",
    country: "Romania",
    city: "Constanța",
    region: "romania",
    vibes: ["beach", "relaxation-wellness", "tourist-attractions"],
    activities: ["Beaches", "Swimming", "Seafront nightlife", "History"],
    seasonMonths: [6, 7, 8, 9],
    tagline: "Romania's seaside.",
    bestFor: ["Families", "Friend groups"],
  },
  {
    kind: "destination",
    slug: "swiss-alps-interlaken",
    title: "Swiss Alps (Interlaken)",
    country: "Switzerland",
    city: "Interlaken",
    region: "international",
    vibes: ["mountain", "adventure", "nature-landscapes"],
    activities: ["Hiking", "Paragliding", "Scenic rail", "Lakes"],
    seasonMonths: [1, 2, 6, 7, 8, 9, 12],
    tagline: "Big-mountain drama and adrenaline.",
    bestFor: ["Adventure seekers"],
  },
  {
    kind: "destination",
    slug: "brasov-carpathians",
    title: "Brașov & the Carpathians",
    country: "Romania",
    city: "Brașov",
    region: "romania",
    vibes: ["mountain", "city-break", "historical-monuments", "adventure"],
    activities: ["Old-town wandering", "Hiking", "Castle visits", "Cable car"],
    seasonMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    tagline: "Fairy-tale medieval old town with mountains on the doorstep.",
    bestFor: ["First-timers"],
  },
  {
    kind: "destination",
    slug: "danube-delta",
    title: "Danube Delta",
    country: "Romania",
    city: "Tulcea",
    region: "romania",
    vibes: ["nature-landscapes", "adventure", "relaxation-wellness"],
    activities: ["Boat safaris", "Birdwatching", "Fishing villages", "Sunrises"],
    seasonMonths: [5, 6, 7, 8, 9, 10],
    tagline: "Europe's largest wetland.",
    bestFor: ["Couples", "Nature lovers"],
  },
  {
    kind: "destination",
    slug: "sibiu-transfagarasan",
    title: "Sibiu & the Transfăgărășan",
    country: "Romania",
    city: "Sibiu",
    region: "romania",
    vibes: ["city-break", "historical-monuments", "adventure", "mountain"],
    activities: ["Old-town wandering", "Scenic driving", "Mountain hikes", "Culture"],
    seasonMonths: [5, 6, 7, 8, 9, 10],
    tagline: "A storybook Saxon city beside a spectacular driving road.",
    bestFor: ["Road-trippers"],
  },
  {
    kind: "package",
    slug: "transylvania-5-days",
    title: "Transylvania in 5 Days",
    vibes: ["historical-monuments", "city-break", "mountain"],
    activities: ["Old towns", "Castles", "Mountain scenery"],
    seasonMonths: [4, 5, 6, 7, 8, 9, 10],
    durationDays: 5,
    priceFrom: 390,
    priceTo: 520,
    currency: "EUR",
    tagline: "Castles, cobblestones, and mountains.",
    greatFor: ["Students", "First-timers"],
    countries: ["Romania"],
    cities: ["Brașov", "Sibiu"],
  },
  {
    kind: "package",
    slug: "danube-delta-slow-escape",
    title: "Danube Delta Slow Escape",
    vibes: ["nature-landscapes", "relaxation-wellness", "adventure"],
    activities: ["Boat safaris", "Birdwatching", "Fishing villages"],
    seasonMonths: [5, 6, 7, 8, 9, 10],
    durationDays: 4,
    priceFrom: 340,
    priceTo: 460,
    currency: "EUR",
    tagline: "Four slow days in Europe's wildest wetland.",
    greatFor: ["Couples", "Nature lovers"],
    countries: ["Romania"],
    cities: ["Tulcea"],
  },
  {
    kind: "package",
    slug: "black-sea-summer",
    title: "Black Sea Summer",
    vibes: ["beach", "relaxation-wellness"],
    activities: ["Beaches", "Swimming", "Old town"],
    seasonMonths: [6, 7, 8, 9],
    durationDays: 5,
    priceFrom: 300,
    priceTo: 450,
    currency: "EUR",
    tagline: "Five easy days of sun, sand, and seaside.",
    greatFor: ["Families", "Friend groups"],
    countries: ["Romania"],
    cities: ["Constanța"],
  },
  {
    kind: "package",
    slug: "santorini-sunsets",
    title: "Santorini Sunsets",
    vibes: ["beach", "relaxation-wellness"],
    activities: ["Sunsets", "Beaches", "Wine tasting"],
    seasonMonths: [5, 6, 7, 8, 9, 10],
    durationDays: 6,
    priceFrom: 780,
    priceTo: 1150,
    currency: "EUR",
    tagline: "Six days of caldera views and slow romance.",
    greatFor: ["Couples", "A romantic milestone"],
    countries: ["Greece"],
    cities: ["Fira"],
  },
  {
    kind: "package",
    slug: "roman-holiday",
    title: "Roman Holiday",
    vibes: ["city-break", "historical-monuments", "tourist-attractions"],
    activities: ["Sightseeing", "Museums", "Food"],
    seasonMonths: [3, 4, 5, 9, 10, 11],
    durationDays: 4,
    priceFrom: 520,
    priceTo: 780,
    currency: "EUR",
    tagline: "Four days, three thousand years, endless pasta.",
    greatFor: ["City lovers", "Culture seekers"],
    countries: ["Italy"],
    cities: ["Rome"],
  },
  {
    kind: "package",
    slug: "bali-winter-escape",
    title: "Bali Winter Escape",
    vibes: ["beach", "relaxation-wellness", "adventure"],
    activities: ["Beaches", "Yoga & wellness", "Volcano hike", "Temples"],
    seasonMonths: [4, 5, 6, 7, 8, 9, 10],
    durationDays: 8,
    priceFrom: 1250,
    priceTo: 1800,
    currency: "EUR",
    tagline: "Eight days of warmth when home is at its coldest.",
    greatFor: ["Wellness travellers"],
    countries: ["Indonesia"],
    cities: ["Ubud"],
  },
];

const index = buildIndex(CATALOG);

function slugsOf(query: string): string[] {
  return search(query, index).results.map((r) => r.item.slug);
}

describe("Voia smart search", () => {
  test("beach holiday surfaces beach destinations and trips", () => {
    const slugs = slugsOf("beach holiday");
    assert.ok(slugs.length > 0, "expected results");
    assert.ok(
      slugs.includes("santorini") || slugs.includes("bali") || slugs.includes("black-sea-coast"),
      "expected a beach destination near the top",
    );
    const top = search("beach holiday", index).results[0];
    assert.equal(top.item.vibes.includes("beach"), true);
  });

  test("Greece resolves to Santorini and Santorini Sunsets", () => {
    const slugs = slugsOf("Greece");
    assert.ok(slugs.includes("santorini"));
    assert.ok(slugs.includes("santorini-sunsets"));
  });

  test("Italy resolves to Rome and Roman Holiday", () => {
    const slugs = slugsOf("Italy");
    assert.ok(slugs.includes("rome"));
    assert.ok(slugs.includes("roman-holiday"));
  });

  test("Paris (not in catalog) degrades gracefully — no crash, empty-state ok", () => {
    const { results } = search("Paris", index);
    assert.ok(Array.isArray(results));
  });

  test("family vacation favours family-friendly trips", () => {
    const { results, facets } = search("family vacation", index);
    assert.ok(Array.isArray(results));
    assert.equal(facets.freeText.includes("vacation"), false, "vacation is filler, not a facet or free-text token");
  });

  test("honeymoon maps to the relaxation-wellness vibe", () => {
    const { facets } = search("honeymoon", index);
    assert.ok(facets.vibes.includes("relaxation-wellness"));
  });

  test('"city break" maps to the city-break vibe', () => {
    const { facets, results } = search("city break", index);
    assert.ok(facets.vibes.includes("city-break"));
    const slugs = results.map((r) => r.item.slug);
    assert.ok(slugs.includes("rome") || slugs.includes("roman-holiday"));
  });

  test("mountain trip maps to the mountain vibe", () => {
    const { facets, results } = search("mountain trip", index);
    assert.ok(facets.vibes.includes("mountain"));
    assert.ok(results.some((r) => r.item.vibes.includes("mountain")));
  });

  test("under €1000 sets a price ceiling and excludes pricier trips", () => {
    const { facets, results } = search("under €1000", index);
    assert.equal(facets.priceMax, 1000);
    const packageResults = results.filter((r) => r.item.kind === "package");
    assert.ok(packageResults.every((r) => r.item.kind === "package" && r.item.priceFrom <= 1000));
    assert.ok(packageResults.some((r) => r.item.slug === "santorini-sunsets"));
    assert.ok(!packageResults.some((r) => r.item.slug === "bali-winter-escape"));
  });

  test("luxury sets a price floor and surfaces the splurge trips", () => {
    const { facets, results } = search("luxury", index);
    assert.ok(typeof facets.priceMin === "number" && facets.priceMin >= 1000);
    const slugs = results.map((r) => r.item.slug);
    assert.ok(slugs.includes("bali-winter-escape") || slugs.includes("santorini-sunsets"));
  });

  test("budget sets a price ceiling and favours the cheaper trips", () => {
    const { facets, results } = search("budget", index);
    assert.ok(typeof facets.priceMax === "number");
    const slugs = results.map((r) => r.item.slug);
    assert.ok(slugs.includes("transylvania-5-days") || slugs.includes("black-sea-summer"));
  });

  test("adventure maps to the adventure vibe", () => {
    const { facets, results } = search("adventure", index);
    assert.ok(facets.vibes.includes("adventure"));
    assert.ok(results.some((r) => r.item.vibes.includes("adventure")));
  });

  test("2 people parses a people facet", () => {
    const { facets } = search("2 people", index);
    assert.equal(facets.people, 2);
  });

  test("July parses a month facet and matches July-friendly trips", () => {
    const { facets, results } = search("July", index);
    assert.ok(facets.months.includes(7));
    assert.ok(results.some((r) => r.item.seasonMonths.includes(7)));
  });

  test("7 days parses a duration facet", () => {
    const { facets, results } = search("7 days", index);
    assert.ok(typeof facets.durationMin === "number" && typeof facets.durationMax === "number");
    const packageResults = results.filter((r) => r.item.kind === "package");
    assert.ok(
      packageResults.every(
        (r) =>
          r.item.kind === "package" &&
          r.item.durationDays >= (facets.durationMin ?? 0) &&
          r.item.durationDays <= (facets.durationMax ?? Infinity),
      ),
    );
  });

  test('misspelling "grece" still resolves to Greece', () => {
    const slugs = slugsOf("grece");
    assert.ok(slugs.includes("santorini"));
  });

  test('misspelling "santornini" still resolves to Santorini', () => {
    const slugs = slugsOf("santornini");
    assert.ok(slugs.includes("santorini"));
  });

  test('misspelling "mountian" still resolves to the mountain vibe', () => {
    const { facets, results } = search("mountian", index);
    assert.ok(facets.vibes.includes("mountain"));
    assert.ok(results.some((r) => r.item.vibes.includes("mountain")));
  });

  test("empty query returns no results, not a crash", () => {
    const { results } = search("   ", index);
    assert.deepEqual(results, []);
  });
});
