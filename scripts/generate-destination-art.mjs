// Generates original, license-clean SVG poster art for every destination.
// Plain Node, no dependencies. Run with: node scripts/generate-destination-art.mjs
//
// Emits, per destination, into public/images/destinations/:
//   <slug>.svg      — hero (signature "sunset meets sea" palette)
//   <slug>-1.svg     — gallery: dawn palette, slight composition shift
//   <slug>-2.svg     — gallery: day palette, slight composition shift
//   <slug>-3.svg     — gallery: dusk palette, slight composition shift
//
// Flat travel-poster style: layered silhouette shapes over a two-stop sky
// gradient, built from the Voia brand palette (coral / teal / amber / sand).

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "images", "destinations");
mkdirSync(OUT_DIR, { recursive: true });

const W = 1600;
const H = 1000;

// ---------------------------------------------------------------------------
// Brand palette (matches src/styles/global.css @theme)
// ---------------------------------------------------------------------------
const C = {
  coral50: "#FFF3EE", coral100: "#FFE3D8", coral200: "#FFC3AF", coral300: "#FF9C7E",
  coral400: "#FA7551", coral500: "#EE5A35", coral600: "#D2451F", coral700: "#AC3717",
  coral800: "#882C14", coral900: "#6A2412",
  teal50: "#ECFAF8", teal100: "#CFF1ED", teal200: "#A2E3DC", teal300: "#69CEC5",
  teal400: "#38B2A9", teal500: "#1E9A91", teal600: "#137C74", teal700: "#11645E",
  teal800: "#114F4B", teal900: "#103F3C",
  amber50: "#FFF8EA", amber100: "#FFEFC6", amber200: "#FFDD88", amber300: "#FFC84A",
  amber400: "#FAB31E", amber500: "#E89A06", amber600: "#BE7B04", amber700: "#976009",
  amber800: "#7B4D10", amber900: "#684010",
  sand50: "#FBF8F3", sand100: "#F4EDE5", sand200: "#E8DCCF", sand300: "#D6C6B5",
  sand400: "#B9A693", sand500: "#927F6C", sand600: "#6E5C4B", sand700: "#54463A",
  sand800: "#3B3128", ink: "#2A201B", white: "#FFFFFF",
};

// ---------------------------------------------------------------------------
// Time-of-day palettes. "signature" is the hero look (sunset meets sea, per
// the brand direction). Gallery variants cycle dawn / day / dusk.
// ---------------------------------------------------------------------------
const TIME = {
  signature: {
    skyTop: C.teal700, skyMid: C.coral400, skyBottom: C.amber400,
    sun: C.amber300, sunGlow: C.coral400,
    far: C.teal600, mid: C.coral700, near: C.ink,
    water: C.teal800, waterHi: C.coral500,
    cloud: C.coral200,
  },
  dawn: {
    skyTop: C.coral200, skyMid: C.coral100, skyBottom: C.amber100,
    sun: C.amber200, sunGlow: C.amber100,
    far: C.teal300, mid: C.teal600, near: C.teal800,
    water: C.teal400, waterHi: C.sand100,
    cloud: C.sand50,
  },
  day: {
    skyTop: C.teal300, skyMid: C.teal100, skyBottom: C.sand50,
    sun: C.amber400, sunGlow: C.sand50,
    far: C.teal400, mid: C.teal600, near: C.teal800,
    water: C.teal500, waterHi: C.teal200,
    cloud: C.white,
  },
  dusk: {
    skyTop: C.coral800, skyMid: C.coral600, skyBottom: C.amber400,
    sun: C.amber300, sunGlow: C.coral500,
    far: C.coral800, mid: C.coral900, near: C.ink,
    water: C.coral900, waterHi: C.amber500,
    cloud: C.coral300,
  },
};

// ---------------------------------------------------------------------------
// Small SVG-building helpers
// ---------------------------------------------------------------------------
let gradientCounter = 0;
function nextId(prefix) {
  gradientCounter += 1;
  return `${prefix}${gradientCounter}`;
}

function skyGradientDef(t) {
  const id = nextId("sky");
  return {
    id,
    def: `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${t.skyTop}"/>
      <stop offset="55%" stop-color="${t.skyMid}"/>
      <stop offset="100%" stop-color="${t.skyBottom}"/>
    </linearGradient>`,
  };
}

function glowGradientDef(color) {
  const id = nextId("glow");
  return {
    id,
    def: `<radialGradient id="${id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
    </radialGradient>`,
  };
}

function waterGradientDef(t) {
  const id = nextId("water");
  return {
    id,
    def: `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${t.waterHi}"/>
      <stop offset="100%" stop-color="${t.water}"/>
    </linearGradient>`,
  };
}

function sun(cx, cy, r, t, defs) {
  const glow = glowGradientDef(t.sunGlow);
  defs.push(glow.def);
  return `<circle cx="${cx}" cy="${cy}" r="${r * 3.4}" fill="url(#${glow.id})"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${t.sun}"/>`;
}

function cloud(cx, cy, scale, color, opacity = 0.55) {
  return `<g opacity="${opacity}" fill="${color}">
    <ellipse cx="${cx}" cy="${cy}" rx="${70 * scale}" ry="${22 * scale}"/>
    <ellipse cx="${cx + 55 * scale}" cy="${cy - 10 * scale}" rx="${46 * scale}" ry="${18 * scale}"/>
    <ellipse cx="${cx - 50 * scale}" cy="${cy - 6 * scale}" rx="${40 * scale}" ry="${16 * scale}"/>
  </g>`;
}

// Jagged mountain ridge silhouette across the full width.
function ridge(baseY, peaks, color, opacity = 1) {
  let d = `M0,${H}`;
  d += ` L0,${baseY}`;
  peaks.forEach(([x, y]) => {
    d += ` L${x},${y}`;
  });
  d += ` L${W},${baseY} L${W},${H} Z`;
  return `<path d="${d}" fill="${color}" opacity="${opacity}"/>`;
}

function snowCap(peakX, peakY, width, color = C.white, opacity = 0.9) {
  const half = width / 2;
  return `<path d="M${peakX - half},${peakY + width * 0.6} L${peakX},${peakY} L${peakX + half},${peakY + width * 0.6} L${peakX + half * 0.4},${peakY + width * 0.42} L${peakX},${peakY + width * 0.62} L${peakX - half * 0.4},${peakY + width * 0.42} Z" fill="${color}" opacity="${opacity}"/>`;
}

function pine(x, y, scale, color) {
  const w = 26 * scale;
  const h = 70 * scale;
  return `<g fill="${color}">
    <polygon points="${x},${y - h} ${x - w},${y - h * 0.42} ${x + w},${y - h * 0.42}"/>
    <polygon points="${x},${y - h * 0.62} ${x - w * 0.8},${y - h * 0.1} ${x + w * 0.8},${y - h * 0.1}"/>
    <polygon points="${x},${y - h * 0.3} ${x - w * 0.65},${y} ${x + w * 0.65},${y}"/>
    <rect x="${x - 4 * scale}" y="${y - 6 * scale}" width="${8 * scale}" height="${10 * scale}"/>
  </g>`;
}

function palm(x, y, scale, color) {
  const trunkH = 90 * scale;
  const lean = 10 * scale;
  return `<g fill="${color}">
    <path d="M${x},${y} Q${x + lean},${y - trunkH * 0.55} ${x + lean * 1.6},${y - trunkH} L${x + lean * 1.6 + 6 * scale},${y - trunkH} Q${x + lean * 0.9},${y - trunkH * 0.5} ${x + 6 * scale},${y} Z"/>
    <g transform="translate(${x + lean * 1.6},${y - trunkH})">
      ${[0, 55, 110, 160, 210, 260, 310].map((deg) => `<path transform="rotate(${deg})" d="M0,0 Q${46 * scale},${-8 * scale} ${64 * scale},${10 * scale} Q${40 * scale},${6 * scale} 0,0 Z"/>`).join("")}
    </g>
  </g>`;
}

function waterBand(y, t, defs) {
  const grad = waterGradientDef(t);
  defs.push(grad.def);
  const lines = Array.from({ length: 6 }, (_, i) => {
    const ly = y + 40 + i * ((H - y - 40) / 6);
    const w = 120 + (i % 3) * 60;
    const x = 200 + ((i * 340) % (W - 400));
    return `<rect x="${x}" y="${ly}" width="${w}" height="4" rx="2" fill="${t.waterHi}" opacity="${0.18 + (i % 2) * 0.1}"/>`;
  }).join("");
  return `<rect x="0" y="${y}" width="${W}" height="${H - y}" fill="url(#${grad.id})"/>${lines}`;
}

function bird(x, y, scale, color) {
  return `<path d="M${x - 24 * scale},${y} Q${x - 10 * scale},${y - 16 * scale} ${x},${y} Q${x + 10 * scale},${y - 16 * scale} ${x + 24 * scale},${y}" stroke="${color}" stroke-width="${3.5 * scale}" fill="none" stroke-linecap="round"/>`;
}

function reed(x, y, h, color) {
  return `<path d="M${x},${y} Q${x - 8},${y - h * 0.6} ${x + 4},${y - h}" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
}

function cubeHouse(x, y, size, wallColor, domeColor, domed) {
  const w = size;
  const h = size * 0.85;
  let g = `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${wallColor}"/>`;
  if (domed) {
    g += `<circle cx="${x + w / 2}" cy="${y - h}" r="${w * 0.42}" fill="${domeColor}"/>`;
  } else {
    g += `<rect x="${x - 3}" y="${y - h - 8}" width="${w + 6}" height="10" fill="${wallColor}"/>`;
  }
  g += `<rect x="${x + w * 0.28}" y="${y - h * 0.5}" width="${w * 0.18}" height="${h * 0.32}" fill="${domeColor}" opacity="0.8"/>`;
  return g;
}

function towerHouse(x, y, w, h, wallColor, roofColor) {
  return `<g>
    <rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${wallColor}"/>
    <polygon points="${x - 6},${y - h} ${x + w / 2},${y - h - w * 0.7} ${x + w + 6},${y - h}" fill="${roofColor}"/>
    <rect x="${x + w * 0.35}" y="${y - h * 0.45}" width="${w * 0.3}" height="${h * 0.3}" fill="${roofColor}" opacity="0.7"/>
  </g>`;
}

function domeBuilding(x, y, w, h, color, withDome) {
  let g = `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${color}"/>`;
  if (withDome) {
    g += `<circle cx="${x + w / 2}" cy="${y - h}" r="${w * 0.55}" fill="${color}"/>`;
    g += `<rect x="${x + w / 2 - 4}" y="${y - h - w * 0.55 - 22}" width="8" height="22" fill="${color}"/>`;
  } else {
    g += `<polygon points="${x - 4},${y - h} ${x + w / 2},${y - h - w * 0.4} ${x + w + 4},${y - h}" fill="${color}"/>`;
  }
  return g;
}

function road(pathD, color, width = 16) {
  return `<path d="${pathD}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>
  <path d="${pathD}" fill="none" stroke="${C.white}" stroke-width="${width * 0.12}" stroke-dasharray="18 22" opacity="0.5"/>`;
}

function terraceLines(x, y, w, rows, colorA, colorB) {
  let g = "";
  for (let i = 0; i < rows; i += 1) {
    const ry = y + i * 22;
    const rw = w - i * 14;
    const rx = x + i * 7;
    g += `<path d="M${rx},${ry} Q${rx + rw / 2},${ry - 14} ${rx + rw},${ry} L${rx + rw},${ry + 16} Q${rx + rw / 2},${ry + 2} ${rx},${ry + 16} Z" fill="${i % 2 === 0 ? colorA : colorB}" opacity="${0.85 - i * 0.03}"/>`;
  }
  return g;
}

function umbrella(x, y, scale, canopyColor, poleColor) {
  const r = 90 * scale;
  return `<g>
    <rect x="${x - 4 * scale}" y="${y - r * 0.9}" width="${8 * scale}" height="${r * 1.4}" fill="${poleColor}"/>
    <path d="M${x - r},${y - r * 0.9} A${r},${r * 0.6} 0 0 1 ${x + r},${y - r * 0.9} Z" fill="${canopyColor}"/>
    <path d="M${x - r},${y - r * 0.9} A${r},${r * 0.6} 0 0 1 ${x},${y - r * 1.3} A${r},${r * 0.6} 0 0 1 ${x + r},${y - r * 0.9} Z" fill="${canopyColor}" opacity="0.85"/>
  </g>`;
}

function sandDune(y, color) {
  return `<path d="M0,${H} L0,${y + 30} Q${W * 0.3},${y - 20} ${W * 0.5},${y} Q${W * 0.75},${y + 20} ${W},${y - 10} L${W},${H} Z" fill="${color}"/>`;
}

function castleTower(x, y, w, h, color, roofColor) {
  return `<g>
    <rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${color}"/>
    <polygon points="${x - 5},${y - h + 4} ${x + w / 2},${y - h - w * 0.9} ${x + w + 5},${y - h + 4}" fill="${roofColor}"/>
  </g>`;
}

// ---------------------------------------------------------------------------
// Scene archetypes — one per destination. Each returns the full <svg> markup
// for a given time-of-day palette `t` and a small `seed` (0..3) that shifts
// the composition slightly between hero / gallery variants.
// ---------------------------------------------------------------------------
const SCENES = {
  santorini(t, seed) {
    const defs = [];
    const sunX = 620 + seed * 90;
    const sunY = 430 + seed * 12;
    let g = "";
    g += sun(sunX, sunY, 46, t, defs);
    g += cloud(300 + seed * 40, 190, 1, t.cloud, 0.4);
    g += ridge(560, [[0, 600], [420, 520], [900, 560], [1600, 500]], t.far, 0.55);
    g += waterBand(640, t, defs);
    // caldera cliff
    g += `<path d="M0,660 L0,560 Q500,500 900,600 Q1250,660 1600,600 L1600,700 Q1000,760 600,700 Q300,660 0,660Z" fill="${t.near}"/>`;
    // whitewashed village along the cliff edge
    const houses = [
      [340, 600, 70, false], [430, 585, 60, true], [510, 600, 66, false],
      [610, 578, 58, true], [700, 596, 72, false], [800, 580, 60, true],
      [900, 604, 64, false], [990, 586, 58, true], [1080, 600, 70, false],
      [1170, 582, 60, true], [1260, 598, 66, false],
    ];
    const domeColor = t === TIME.dawn ? C.teal500 : C.teal700;
    houses.forEach(([x, y, size, domed]) => {
      g += cubeHouse(x, y, size, C.white, domeColor, domed);
    });
    return wrap(t, g, defs);
  },

  bali(t, seed) {
    const defs = [];
    const sunX = 500 + seed * 60;
    let g = "";
    g += sun(sunX, 320, 44, t, defs);
    // volcano
    g += ridge(560, [[0, 560], [1150, 300], [1600, 560]], t.far, 0.5);
    g += ridge(600, [[0, 620], [1600, 560]], t.mid, 0.3);
    // terraced rice fields
    g += terraceLines(120, 600, 900, 9, t.mid, t.near);
    g += terraceLines(950 - seed * 30, 560, 560, 7, t.far, t.mid);
    // palms
    g += palm(220, 900, 1.1, t.near);
    g += palm(1360, 880, 1.3, t.near);
    g += palm(1460, 940, 0.9, t.near);
    return wrap(t, g, defs);
  },

  "swiss-alps-interlaken"(t, seed) {
    const defs = [];
    let g = "";
    g += sun(1180 + seed * 40, 260, 42, t, defs);
    g += ridge(460, [[0, 520], [260, 300], [520, 430], [820, 240], [1120, 420], [1400, 300], [1600, 460]], t.far, 0.55);
    g += snowCap(520, 240, 220, C.white, 0.92);
    g += snowCap(820, 240, 260, C.white, 0.95);
    g += snowCap(1400, 300, 200, C.white, 0.85);
    g += ridge(560, [[0, 600], [400, 480], [900, 560], [1600, 500]], t.mid, 0.65);
    g += waterBand(660, t, defs);
    g += pine(260 + seed * 10, 900, 1.4, t.near);
    g += pine(340 + seed * 10, 920, 1.1, t.near);
    g += pine(1280, 900, 1.3, t.near);
    g += pine(1360, 930, 1.0, t.near);
    return wrap(t, g, defs);
  },

  rome(t, seed) {
    const defs = [];
    let g = "";
    g += sun(300 + seed * 50, 300, 40, t, defs);
    g += ridge(680, [[0, 700], [1600, 680]], t.far, 0.4);
    const buildings = [
      [200, 700, 70, 160, false], [290, 700, 90, 220, true], [410, 700, 60, 140, false],
      [500, 700, 100, 260, false], [630, 700, 80, 190, true], [740, 700, 66, 150, false],
      [840, 700, 120, 300, true], [1000, 700, 70, 170, false], [1100, 700, 90, 230, false],
      [1220, 700, 66, 150, true], [1320, 700, 100, 210, false], [1460, 700, 80, 180, false],
    ];
    buildings.forEach(([x, y, w, h, dome]) => {
      g += domeBuilding(x, y - seed * 4, w, h, t.near, dome);
    });
    // Colosseum-style arches motif, centered
    g += `<g fill="${t.mid}"><rect x="640" y="560" width="320" height="140" rx="6"/>${Array.from({ length: 8 }, (_, i) => `<circle cx="${665 + i * 38}" cy="600" r="15" fill="${t.skyBottom}"/>`).join("")}</g>`;
    return wrap(t, g, defs);
  },

  "sibiu-transfagarasan"(t, seed) {
    const defs = [];
    let g = "";
    g += sun(1150 + seed * 30, 280, 40, t, defs);
    g += ridge(460, [[0, 560], [400, 380], [800, 300], [1200, 400], [1600, 520]], t.far, 0.55);
    g += ridge(580, [[0, 640], [600, 500], [1600, 600]], t.mid, 0.7);
    g += road(`M120,940 C260,820 220,700 380,640 C520,590 480,480 640,440 C760,410 720,320 860,300`, t.near, 18 - seed);
    g += pine(180, 960, 1.2, t.near);
    g += pine(1420, 900, 1.3, t.near);
    g += pine(1500, 940, 1.0, t.near);
    // small town cluster
    [[1080, 880], [1150, 870], [1220, 890]].forEach(([x, y], i) => {
      g += towerHouse(x, y, 60 + i * 6, 90 + i * 8, t.mid, t.near);
    });
    return wrap(t, g, defs);
  },

  "brasov-carpathians"(t, seed) {
    const defs = [];
    let g = "";
    g += sun(1200 + seed * 20, 260, 40, t, defs);
    g += ridge(440, [[0, 540], [300, 320], [700, 260], [1050, 360], [1400, 280], [1600, 440]], t.far, 0.55);
    g += ridge(560, [[0, 620], [500, 480], [1600, 560]], t.mid, 0.6);
    g += pine(150, 880, 1.3, t.near);
    g += pine(240, 920, 1.0, t.near);
    // medieval old-town cluster with a clock tower
    const town = [
      [560, 820, 90, 150], [660, 820, 70, 120], [740, 820, 100, 180],
      [860, 820, 74, 130], [950, 820, 90, 160], [1050, 820, 70, 120],
    ];
    town.forEach(([x, y, w, h]) => {
      g += castleTower(x, y, w, h, t.near, t.mid);
    });
    g += castleTower(790, 820, 56, 260, t.near, t.mid); // clock tower, taller
    g += pine(1360, 900, 1.2, t.near);
    g += pine(1450, 930, 0.9, t.near);
    return wrap(t, g, defs);
  },

  "danube-delta"(t, seed) {
    const defs = [];
    let g = "";
    g += sun(760 + seed * 60, 480, 50, t, defs);
    g += waterBand(560, t, defs);
    for (let i = 0; i < 40; i += 1) {
      const x = (i * 47 + seed * 13) % W;
      const y = 600 + ((i * 71) % 340);
      g += reed(x, y, 60 + (i % 3) * 20, t.near);
    }
    g += bird(900 + seed * 30, 380, 1.4, t.near);
    g += bird(970 + seed * 30, 410, 1.0, t.near);
    g += bird(840 + seed * 30, 420, 0.9, t.near);
    return wrap(t, g, defs);
  },

  "black-sea-coast"(t, seed) {
    const defs = [];
    let g = "";
    g += sun(500 + seed * 60, 340, 48, t, defs);
    g += waterBand(560, t, defs);
    g += sandDune(680, t.cloud === C.white ? C.sand100 : C.sand200);
    g += `<rect x="0" y="700" width="${W}" height="300" fill="${C.sand100}"/>`;
    g += umbrella(560, 820, 1.2, t.near, t.mid);
    g += umbrella(760, 860, 0.9, t.mid, t.near);
    g += umbrella(1020, 830, 1.05, t.near, t.mid);
    return wrap(t, g, defs);
  },
};

function wrap(t, motifs, defs) {
  const skyGrad = skyGradientDef(t);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img">
  <defs>
    ${skyGrad.def}
    ${defs.join("\n    ")}
  </defs>
  <rect width="${W}" height="${H}" fill="url(#${skyGrad.id})"/>
  ${motifs}
</svg>`;
}

// ---------------------------------------------------------------------------
// Generate hero + 3 gallery variants per destination
// ---------------------------------------------------------------------------
const SLUGS = Object.keys(SCENES);
const VARIANTS = [
  { suffix: "", time: "signature", seed: 0 },
  { suffix: "-1", time: "dawn", seed: 1 },
  { suffix: "-2", time: "day", seed: 2 },
  { suffix: "-3", time: "dusk", seed: 3 },
];

let totalBytes = 0;
for (const slug of SLUGS) {
  for (const variant of VARIANTS) {
    const svg = SCENES[slug](TIME[variant.time], variant.seed);
    const outPath = join(OUT_DIR, `${slug}${variant.suffix}.svg`);
    writeFileSync(outPath, svg, "utf8");
    totalBytes += Buffer.byteLength(svg, "utf8");
    console.log(`wrote ${outPath} (${(Buffer.byteLength(svg, "utf8") / 1024).toFixed(1)} KB)`);
  }
}
console.log(`\nDone. ${SLUGS.length} destinations × 4 files = ${SLUGS.length * 4} SVGs, ${(totalBytes / 1024).toFixed(1)} KB total.`);
