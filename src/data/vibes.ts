export const VIBE_SLUGS = [
  "beach",
  "mountain",
  "city-break",
  "historical-monuments",
  "tourist-attractions",
  "nature-landscapes",
  "adventure",
  "relaxation-wellness",
] as const;

export type VibeSlug = (typeof VIBE_SLUGS)[number];

export interface Vibe {
  slug: VibeSlug;
  name: string;
  icon: string;
  teaser: string;
  intro: string;
}

export const VIBES: Vibe[] = [
  {
    slug: "beach",
    name: "Beach",
    icon: "umbrella",
    teaser: "Sand, sea, and slow days.",
    intro:
      "Somewhere to slow down by the water — here's where to find sand and sea.",
  },
  {
    slug: "mountain",
    name: "Mountain",
    icon: "mountain",
    teaser: "Peaks, trails, and fresh air.",
    intro:
      "Fresh air, big views, and trails to match. These places have the mountains.",
  },
  {
    slug: "city-break",
    name: "City Break",
    icon: "building2",
    teaser: "Cafés, streets, and good chaos.",
    intro:
      "Streets to wander and cafés to linger in — city breaks with character.",
  },
  {
    slug: "historical-monuments",
    name: "Historical Monuments",
    icon: "landmark",
    teaser: "Castles, ruins, and old stories.",
    intro:
      "Castles, ruins, and centuries of stories — history you can stand inside.",
  },
  {
    slug: "tourist-attractions",
    name: "Tourist Attractions",
    icon: "camera",
    teaser: "The big sights, worth the trip.",
    intro: "The famous, bucket-list sights — the ones worth the trip.",
  },
  {
    slug: "nature-landscapes",
    name: "Nature & Landscapes",
    icon: "trees",
    teaser: "Forests, deltas, and big views.",
    intro:
      "Forests, water, and wide-open views. Nature, front and centre.",
  },
  {
    slug: "adventure",
    name: "Adventure",
    icon: "compass",
    teaser: "A little adrenaline, a lot of yes.",
    intro:
      "A bit of adrenaline and a lot of yes — for trips with a pulse.",
  },
  {
    slug: "relaxation-wellness",
    name: "Relaxation & Wellness",
    icon: "flower2",
    teaser: "Spa days and deep exhales.",
    intro: "Spa days, quiet, and a proper exhale. Come back rested.",
  },
];
