# eugeniedo.com — source

Vite + React source for eugeniedo.com
(GitHub repo `chiknwingsnfrenchfries/Eugeniewebpage`, which holds only the compiled output).

## Where this came from

The original source was lost (the build sandbox reset) and only built `dist/` files were ever
committed. This project was reconstructed on 2026-11-14 from:

- **Components and pages** — rebuilt against the compiled bundle in the repo, using the source
  written in the original Claude chat as the starting point.
- **Translations (`src/lib/i18n.js`), CSS, images, index.html** — extracted from the repo's
  compiled files (`assets/index-Bi_j-VdU.js` as it was before commit `704305e`,
  `assets/index-CS8mZISR.css`, `index.html`, `assets/*.jpg|png`).

Verification, with `SHOW_REVIEWS = true`: `npm run build` on this source produces

- a CSS file byte-identical to the live `assets/index-CS8mZISR.css`
- an `index.html` identical to live apart from hashed asset filenames
- a JS bundle whose application code is identical, once both are formatted, to the bundle as it
  was before the reviews were hidden (`assets/index-wmukeKSn.js`)

Component and variable names are reconstructed (minification discards them), and the per-file CSS
split is inferred from the order styles appear in the bundle. Behaviour and output are what was verified.

## Reviews are currently hidden

Commit `704305e` hid the Reviews nav link (desktop, mobile drawer, footer) and the home page
testimonials section by patching `false&&` into the compiled bundle. Here that is a real switch:
`src/lib/flags.js` → `SHOW_REVIEWS`. It is set to `false` to match the live site; set it to
`true` to bring reviews back.

## Layout

```
index.html
favicon.svg                 the "E" favicon referenced by index.html
public/assets/              eugenie-hero.jpg, eugenie-hero-mobile.jpg, eugenie-about.jpg,
                            eugenie-logo.png, remax-platine.png
src/
  main.jsx                  entry + local fonts (@fontsource)
  App.jsx                   hash router: #/<lang>/<page>, FR/EN
  index.css                 design tokens + globals
  lib/
    i18n.js                 ALL copy, FR + EN, plus useLang()
    supabase.js             supabaseInsert() for the contact + newsletter forms
    flags.js                SHOW_REVIEWS
  components/               Nav, Footer, Newsletter, InstagramFeed (+ .css each)
  pages/                    Home, About, Reviews, Resources, Guide, Blog, Contact (+ .css each)
```

Known placeholders carried over from the live site: the Instagram feed uses Unsplash images,
blog posts and the four guides are placeholder content, and the testimonial photos
(`./assets/testimonials/*.jpg`) are not in the repo, so the initials fallback shows.

## Run / build

```
npm install
npm run dev
npm run build        # outputs dist/
```

## Deploying from source

The repo's current workflow (`.github/workflows/deploy-pages.yml`) uploads the repo root as-is,
which works only because the root holds pre-built files. Once this source is in the repo, the
workflow needs a build step and must publish `dist/` instead:

```yaml
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

If the site uses a custom domain via a `CNAME` file, put that file in `public/` so it lands in `dist/`.
The old built files at the repo root (`assets/index-*.js|css`, fonts, root `index.html`) can then be removed.
