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
    tagline: z.string(),
    highlights: z.array(z.string()).min(1),
    goodToKnow: z.array(z.string()).default([]),
    bestFor: z.array(z.string()).default([]),
    package: reference("packages").optional(),
    featured: z.boolean().default(false),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
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
    featured: z.boolean().default(false),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

export const collections = { destinations, packages };
