# Coffee Hub

A personal coffee companion that runs entirely in the browser. Learn coffee in depth, then log your brews so you can repeat the good ones.

- **Learn**: beans and varietals, an origins map, step-through processing journeys, a live roast slider, grind and water, seven brewing methods with recipes and tweak guides, a flavour wheel, and the farm-to-cup supply chain.
- **Brew**: a ratio calculator and a guided step timer for each method that saves straight into the log.
- **Log**: beans and brews with dose, water, grind, temperature, time, rating, taste sliders, flavour tags and notes. "Brew again" prefills a new entry from a previous one.
- **Backup**: export everything to one JSON file and import it anywhere. No accounts, no server.

Installable as a PWA and works offline.

## Develop

```
npm install
npm run dev
```

```
npm test          # vitest
npm run typecheck # tsc
npm run build     # production build in dist/
node scripts/make-icons.mjs   # regenerate PWA icons
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which tests, builds and publishes `dist/` to GitHub Pages. In the repository settings, set **Pages → Source** to **GitHub Actions** once.

The build uses relative asset paths and hash routing, so it works at any subpath.
