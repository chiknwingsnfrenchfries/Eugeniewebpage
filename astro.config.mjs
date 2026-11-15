import { defineConfig } from 'astro/config'

// Static site: every page is a real HTML file at its own URL (see src/lib/routes.js).
export default defineConfig({
  site: 'https://eugeniedo.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
})
