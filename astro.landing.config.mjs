import { defineConfig } from 'astro/config'

// Second build: the ads landing page for landing1.eugeniedo.com (Cloudflare Pages project landing1-eugeniedo).
//   npm run build:landing  →  dist-landing/
// Pages live in src-landing/pages and reuse components from src/.
export default defineConfig({
  site: 'https://landing1.eugeniedo.com',
  srcDir: './src-landing',
  publicDir: './public-landing',
  outDir: './dist-landing',
  trailingSlash: 'always',
  build: { format: 'directory' },
})
