// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import netlify from '@astrojs/netlify';

// https://astro.build/config
// (saved to make the dev server restart and reload .env — safe to delete)
export default defineConfig({
  site: 'https://celebrated-gumption-a7231a.netlify.app',
  // Default static output; the Netlify adapter still emits on-demand
  // functions for any route that opts in via `export const prerender = false`.
  adapter: netlify(),
  vite: {
    plugins: [tailwindcss()],
    // Force a clean dependency re-bundle to clear Vite's stale optimize cache
    // (the "504 Outdated Optimize Dep" error). Safe to remove once healthy.
    optimizeDeps: { force: true }
  }
});