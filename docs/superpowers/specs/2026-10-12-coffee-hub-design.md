# Coffee Hub: design

Date: 2026-10-12

## Purpose

A personal coffee companion that runs entirely in the browser. Two halves:

1. **Learn**: an interactive reference covering beans, origins, processing, roasting, grind, water, brewing methods and sourcing.
2. **Log**: a structured brew journal so the owner can reproduce and refine brews with data rather than memory.

Constraints set by the owner:

- Personal use only. No accounts, no sign-in, no server.
- All data stays in the browser (IndexedDB). Backup is a JSON export/import file.
- Installable PWA, works offline, usable on a phone.
- Hosted on GitHub Pages under lokeshnanda.com, built from this repo.
- Keep it simple. Few dependencies.

Success looks like: the owner can open the app on their phone, start a guided V60 timer, save the brew with grind, dose and rating, and two weeks later pull up "best V60 with this bean" and repeat it.

## Stack

- Vite + React 18 + TypeScript.
- Routing: `react-router-dom` with `HashRouter`, so the app works at any GitHub Pages subpath with no 404 redirect trick.
- Storage: `dexie` over IndexedDB. `dexie-react-hooks` for live queries.
- PWA: `vite-plugin-pwa` (Workbox). Precache all built assets. Runtime-cache Google Fonts.
- Styling: plain CSS with custom properties (design tokens). No CSS framework.
- Tests: `vitest` + `@testing-library/react` + `fake-indexeddb` for Dexie tests.
- Deploy: GitHub Actions workflow builds on push to `main` and deploys to GitHub Pages. `base: './'` in Vite so the build is path-agnostic.

## Architecture: structured content + generic interactive components

All learning content is typed data under `src/content/`. A small set of React components render it interactively. Adding a brew method is one data entry; it then appears in the guide, comparison view, timer and the log's method picker. The log and the guides share the same IDs so a brew can link to its method guide and a timer can save straight into the log.

```
src/
  content/          typed data: methods, processing, origins, roasts, flavours, varietals, grind, water, sourcing
  components/       reusable UI (Journey, Comparison, Wheel, Slider, Calculator, Timer, forms)
  db/               Dexie schema, migrations, export/import
  features/
    learn/          Learn hub and topic pages
    brew/           calculator + guided timer
    log/            brews list, brew form, brew detail, beans
    settings/       export/import, preferences
  app/              router, shell, theme
```

## Content model

Every entry has a stable string `id`. Cross-references use those IDs. A test asserts all references resolve.

- **BrewMethod**: id, name, family (`pressure` | `percolation` | `immersion`), tagline, description, device notes, ratio range `[min, max]` (water:coffee), grind band (`extra-fine` … `coarse`), water temperature range (°C), typical total time (s), `steps: RecipeStep[]` where a step has title, instruction, duration (s, optional), and an optional target water weight; common mistakes; tweak guidance (`tooBitter`, `tooSour`, `tooWeak`, `tooStrong`); suited roast range.
- **ProcessingMethod**: id, name, summary, `stages: Stage[]` (title, text, illustration key, flavour impact), flavour tags, origins where common.
- **Origin**: id, name, region (`africa` | `americas` | `asia-pacific`), altitude range, typical processes, flavour tags, map position (x, y as percentages on an equirectangular world image), notable varietals.
- **RoastLevel**: id, name, position (0–100), colour hex, surface oil, acidity, body, sweetness, suits method ids.
- **FlavourNode**: tree of three tiers; leaf nodes are tags used by origins, processing and brew logs.
- **Varietal**: id, name, species, origin ids, notes.
- **GrindSize**: id, name, position (0–100), looks like, suits method ids.
- Prose sections (water, sourcing, roasting chemistry) are markdown strings in content files rendered with a tiny inline renderer (headings, paragraphs, lists only).

## Log data model (Dexie)

```
beans:    ++id, name, roaster, originId, processId, roastPosition, roastDate, varietal?, bagNotes?, archived, createdAt
brews:    ++id, beanId, methodId, device?, grindLabel?, grindValue?, doseG, waterG?, yieldG?, tempC?, timeS?,
          stepTimes?: number[], rating (1–5), bitterness, acidity, sweetness, body (1–5),
          flavourTags: string[], notes?, nextTime?, brewedAt
settings: key (primary), value
```

Indexes: `brews` on `beanId`, `methodId`, `brewedAt`, `rating`, and compound `[beanId+rating]`, `[methodId+rating]`.

Derived in code, not stored: ratio (`waterG / doseG` or `yieldG / doseG` for espresso), days since roast.

Queries the UI needs: best-rated brews for a bean; best brew per method; brews for a bean over time; last brew with a method (for prefilling).

"Brew again" clones a brew's settings into a new unsaved form.

## Export / import

Export: one JSON file `{ schemaVersion, exportedAt, beans, brews, settings }`, downloaded as `coffee-hub-backup-YYYY-MM-DD.json`.

Import: parse, validate shape and `schemaVersion`, migrate forward if older, then show counts and ask **Merge** (upsert by id) or **Replace** (clear then insert). Nothing is written until the user confirms. Errors are shown inline, never thrown to the console only.

## Screens

Bottom tab bar on phone, top nav on desktop. Four tabs: **Learn**, **Brew**, **Log**, **Settings**. Home is the Learn hub.

**Learn**
- Hub: cards for each topic.
- Beans & varietals: species comparison, varietal list.
- Origins: world map explorer; tap a region to see profile and flavour tags; filter by flavour tag.
- Processing: pick a method, step through its journey with an animated stage indicator; side-by-side comparison table.
- Roasting: roast slider from light to dark with live colour, acidity/body/sweetness bars, and suited methods.
- Grind & water: grind scale with illustrations per band; water and ratio basics prose.
- Brewing methods: one page per method with ratio, grind, temperature, steps, mistakes and tweak guide; "Start timer" and "Log a brew" buttons.
- Flavour wheel: radial three-tier wheel; tap to drill in; shows origins and processes associated with a leaf.
- Sourcing: supply chain journey (farm, mill, exporter, roaster, cup) with what each term means.

**Brew**
- Ratio calculator: pick method, enter dose or water, get the other at the method's default ratio; adjustable.
- Guided timer: steps from the method's recipe with countdown per step, total elapsed, target water per step, haptic/vibration on step change where supported, and a "Save as brew" button that opens the log form prefilled with method, dose, water, time and step times.

**Log**
- List: newest first, filter by bean and method, sort by rating. Each row shows bean, method, ratio, rating, date.
- Brew form: all fields from the data model, with sliders for taste dimensions and a flavour tag picker from the wheel. Prefill from "brew again" or from the timer.
- Brew detail: full record, link to method guide, "brew again".
- Beans: list with archive; bean detail shows its brews, best brew, and a rating-over-days-since-roast chart (simple inline SVG).

**Settings**
- Export backup, import backup, theme (system/light/dark), clear all data (double confirm).

## Visual direction

Warm, editorial, coffee-forward. Tokens: a cream/espresso palette with a copper accent; dark mode swaps to deep roast browns. Display font Fraunces for headings, Inter for body (Google Fonts, runtime-cached). Rounded cards, generous spacing, tactile sliders. Motion is used for the journeys, wheel and timer, not everywhere.

## PWA

- Manifest: name "Coffee Hub", short name "Coffee", standalone display, theme colour from tokens, maskable icons at 192 and 512.
- Service worker: precache build output; `registerType: 'autoUpdate'` with a small "Update available" toast.
- Everything works offline after first load, including fonts after they are cached.

## Deploy

- `.github/workflows/deploy.yml`: on push to `main`, install, test, build, upload `dist`, deploy with `actions/deploy-pages`.
- Repo Pages setting must be "GitHub Actions" as source (one-time manual step by owner).

## Error handling

- Dexie errors in forms surface as inline messages with retry.
- Import never partially writes: it runs in a single Dexie transaction.
- Missing content references render a visible "unknown" chip rather than crashing.
- An app-level error boundary shows a reload button.

## Testing

- Content integrity test: every referenced id exists; every method has at least one step; roast and grind positions are 0–100.
- DB tests with `fake-indexeddb`: add/query brews, best-for-bean query, export round-trips through import (merge and replace), migration from an older schemaVersion.
- Pure logic tests: ratio calculator, timer step reducer, days-since-roast.
- Component smoke tests: brew form validates required fields; timer advances steps.
- No end-to-end browser tests; the owner is the only user and will exercise it directly.

## Out of scope

Accounts, cloud sync, Google Drive, sharing, multi-user, analytics, native app stores.
