import { defineCollection, z, reference } from "astro:content";
import { glob } from "astro/loaders";
import { VIBE_SLUGS } from "./data/vibes";

const destinations = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/destinations" }),
  schema: z.object({
    title: z.string(),
    country: z.string(),
    countryFlag: z.string(),
    region: z.enum(["romania", "international"]),
    vibes: z.array(z.enum(VIBE_SLUGS)).min(1),
    bestSeason: z.string(),
    // Recommended months to visit (1–12). Powers the "when to go" filter and
    // smart search. Derived from bestSeason — honest, not invented.
    seasonMonths: z.array(z.number().int().min(1).max(12)).default([]),
    // Nearest city / base — used by search and the detail page.
    city: z.string().optional(),
    // Real, well-known things to do — powers search + richer detail pages.
    activities: z.array(z.string()).default([]),
    tagline: z.string(),
    highlights: z.array(z.string()).min(1),
    goodToKnow: z.array(z.string()).default([]),
    bestFor: z.array(z.string()).default([]),
    package: reference("packages").optional(),
    featured: z.boolean().default(false),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    // Extra scene images for the destination gallery.
    gallery: z
      .array(z.object({ src: z.string(), alt: z.string() }))
      .default([]),
    seoDescription: z.string().optional(),
  }),
});

const packages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/packages" }),
  schema: z.object({
    title: z.string(),
    destinations: z.array(reference("destinations")).min(1),
    vibes: z.array(z.enum(VIBE_SLUGS)).min(1),
    durationDays: z.number(),
    // Recommended months to travel (1–12) — powers the trips "when to go" filter.
    seasonMonths: z.array(z.number().int().min(1).max(12)).default([]),
    activities: z.array(z.string()).default([]),
    priceFrom: z.number(),
    priceTo: z.number(),
    currency: z.string().default("EUR"),
    priceBasis: z.enum(["land-only", "flights-hotel"]),
    priceIsPlaceholder: z.boolean().default(true),
    priceNote: z
      .string()
      .default(
        "Per person, double occupancy. Indicative placeholder — not a real quote.",
      ),
    tagline: z.string(),
    greatFor: z.array(z.string()).min(1),
    highlights: z.array(z.string()).default([]),
    itinerary: z
      .array(
        z.object({
          day: z.number(),
          title: z.string(),
          detail: z.string(),
        }),
      )
      .default([]),
    included: z.array(z.string()).default([]),
    excluded: z.array(z.string()).default([]),
    detailsAreIllustrative: z.boolean().default(true),
    featured: z.boolean().default(false),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

export const collections = { destinations, packages };
