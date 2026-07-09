// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  // Default static output; the Netlify adapter still emits on-demand
  // functions for any route that opts in via `export const prerender = false`.
  adapter: netlify(),
  vite: {
    plugins: [tailwindcss()]
  }
});