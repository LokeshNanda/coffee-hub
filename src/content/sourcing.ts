import type { Stage } from './types';

export const sourcingJourney: Stage[] = [
  {
    title: 'Farm',
    icon: 'cherry',
    text: 'Most of the world\'s coffee is grown by smallholders on less than 2 hectares. A tree takes 3 to 4 years to bear fruit and produces about 1 to 2 kg of green coffee a year. Picking is manual in most origins and is the biggest cost on the farm.',
  },
  {
    title: 'Wet mill',
    icon: 'water',
    text: 'Cherries are delivered the same day to a wet mill (called a washing station in East Africa or a beneficio in Latin America). Here they are sorted, de-pulped, fermented and dried. Many smallholders sell cherry to a cooperative mill; larger farms mill their own.',
  },
  {
    title: 'Dry mill',
    icon: 'gear',
    text: 'Dried parchment coffee rests, then is hulled, polished, screened for size, sorted by density and colour, and hand-picked for defects. This is where grades like AA, SHB or Grade 1 are assigned.',
  },
  {
    title: 'Exporter',
    icon: 'bag',
    text: 'Green coffee is bagged in 60 or 69 kg jute sacks, often with a GrainPro liner, and sold through an exporter who handles contracts, finance, quality control and shipping. Specialty lots are cupped and scored on a 100-point scale; 80 and above is "specialty grade".',
  },
  {
    title: 'Importer',
    icon: 'ship',
    text: 'Containers cross the ocean in 4 to 8 weeks. An importer in the consuming country warehouses the coffee and sells it to roasters in small lots, carrying the stock so a roaster can buy a few bags at a time.',
  },
  {
    title: 'Roaster',
    icon: 'fire',
    text: 'Roasters buy green coffee by the bag, develop a roast profile for each lot, and sell it within weeks of roasting. The best ones publish the farm, process, varietal and altitude on the bag so you can learn from what you drink.',
  },
  {
    title: 'Your cup',
    icon: 'cup',
    text: 'A 250 g bag holds the yearly output of roughly a fifth of a tree. Every variable logged in this app is the last few minutes of a year-long chain.',
  },
];

export const sourcingTerms: { term: string; meaning: string }[] = [
  { term: 'Specialty coffee', meaning: 'Arabica scoring 80 or more out of 100 on a standardised cupping form, with few or no defects. The term is about quality, not price or ethics.' },
  { term: 'Direct trade', meaning: 'A roaster buys from a producer with a direct relationship, usually paying above market and visiting the farm. Not a certification; it means whatever the roaster says it means, so look for specifics.' },
  { term: 'Fair Trade', meaning: 'A certification that guarantees cooperatives a minimum price and a social premium. It protects against market crashes but says nothing about cup quality.' },
  { term: 'C price', meaning: 'The commodity price of arabica on the New York exchange, in US cents per pound. Specialty coffee is priced as a premium on top of it or independently of it.' },
  { term: 'Microlot', meaning: 'A small, separated lot from a specific plot, day or process, kept apart because it cups distinctly well.' },
  { term: 'Cooperative', meaning: 'A group of smallholders who pool cherry, share a mill, and sell together for better prices and access to export.' },
  { term: 'Cup of Excellence', meaning: 'A national competition and auction where the top-scoring lots in a country are sold to the highest bidder, often at many times the market price.' },
  { term: 'Traceability', meaning: 'How far back the bag can be tracked: country, region, cooperative, farm, plot. More traceability generally means more of the price reached the producer.' },
  { term: 'Green coffee', meaning: 'Processed, dried, unroasted seeds. Stable for about a year in good storage before it fades and tastes papery.' },
  { term: 'Screen size', meaning: 'Bean size measured by the holes it passes through, in 64ths of an inch. Screen 17/18 is large. Size does not equal quality but it affects roast consistency.' },
];
