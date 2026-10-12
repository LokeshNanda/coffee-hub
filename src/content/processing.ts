import type { ProcessingMethod } from './types';

export const processing: ProcessingMethod[] = [
  {
    id: 'washed',
    name: 'Washed',
    summary:
      'The fruit is stripped away before drying so the cup reflects the seed itself: clean, bright and transparent. The benchmark process for showing off origin and varietal.',
    stages: [
      { title: 'Harvest', text: 'Ripe red cherries are picked, ideally by hand and in several passes so only ripe fruit is taken.', icon: 'cherry' },
      { title: 'Float and sort', text: 'Cherries go into water tanks. Underripe and damaged fruit floats and is skimmed off.', icon: 'water' },
      { title: 'De-pulp', text: 'A machine squeezes the skin and most of the flesh off, leaving the seed coated in sticky mucilage.', icon: 'gear' },
      { title: 'Ferment', text: 'Seeds sit in tanks for 12 to 72 hours while microbes break down the remaining mucilage.', icon: 'tank', flavourImpact: 'Controlled fermentation adds clarity and a gentle acidity. Too long and it turns vinegary.' },
      { title: 'Wash', text: 'The loosened mucilage is rinsed away in channels of clean water.', icon: 'water' },
      { title: 'Dry', text: 'Parchment-covered seeds dry on raised beds or patios for 1 to 3 weeks to about 11 percent moisture.', icon: 'sun' },
      { title: 'Rest and mill', text: 'The dried parchment rests for a month or more, then is hulled, graded and bagged for export.', icon: 'bag' },
    ],
    flavourTags: ['citrus', 'floral', 'black-tea', 'green-apple'],
    commonIn: ['ethiopia', 'kenya', 'colombia', 'guatemala', 'rwanda'],
    cupCharacter: { clarity: 5, body: 2, fruitiness: 3, sweetness: 3 },
  },
  {
    id: 'natural',
    name: 'Natural',
    summary:
      'The whole cherry dries around the seed for weeks. Sugars and fruit compounds soak in, giving big fruit, heavy body and sometimes a boozy edge. The oldest process and the riskiest to do well.',
    stages: [
      { title: 'Harvest', text: 'Ripe cherries are picked. Ripeness matters even more here because the fruit stays on.', icon: 'cherry' },
      { title: 'Float and sort', text: 'Cherries are floated to remove defects and debris.', icon: 'water' },
      { title: 'Lay out whole', text: 'Whole cherries are spread in a thin layer on raised beds or patios.', icon: 'sun' },
      { title: 'Turn constantly', text: 'For 2 to 4 weeks the cherries are turned many times a day to prevent mould and uneven drying.', icon: 'hand', flavourImpact: 'The fruit ferments slowly around the seed, pushing berry, tropical and wine-like notes into the cup.' },
      { title: 'Dry to raisin', text: 'The cherry shrivels to a dark, raisin-like husk at about 11 percent moisture.', icon: 'raisin' },
      { title: 'Rest and hull', text: 'After resting, the dried husk and parchment are removed mechanically.', icon: 'gear' },
      { title: 'Grade and bag', text: 'Seeds are sorted by size and density and bagged.', icon: 'bag' },
    ],
    flavourTags: ['blueberry', 'strawberry', 'tropical', 'winey', 'chocolate'],
    commonIn: ['ethiopia', 'brazil', 'yemen'],
    cupCharacter: { clarity: 2, body: 5, fruitiness: 5, sweetness: 5 },
  },
  {
    id: 'honey',
    name: 'Honey',
    summary:
      'Skin removed, but some or all of the sticky mucilage (the "honey") is left on during drying. Sits between washed and natural: sweeter and rounder than washed, cleaner than natural. Named by how much mucilage stays: white, yellow, red, black.',
    stages: [
      { title: 'Harvest and sort', text: 'Ripe cherries are picked and floated.', icon: 'cherry' },
      { title: 'De-pulp', text: 'The skin is removed. The de-pulper is set to leave a chosen amount of mucilage on the seed.', icon: 'gear' },
      { title: 'Choose the honey', text: 'Less mucilage and more sun gives yellow honey. More mucilage and shade gives red or black honey.', icon: 'honey', flavourImpact: 'More mucilage and slower drying means more fruit, more sweetness, more body.' },
      { title: 'Dry sticky', text: 'Seeds dry on beds for 1 to 3 weeks. They clump and must be turned carefully.', icon: 'sun' },
      { title: 'Rest and mill', text: 'Dried parchment rests, then is hulled and graded.', icon: 'bag' },
    ],
    flavourTags: ['honey', 'stone-fruit', 'brown-sugar', 'red-apple'],
    commonIn: ['costa-rica', 'brazil', 'el-salvador'],
    cupCharacter: { clarity: 3, body: 4, fruitiness: 4, sweetness: 5 },
  },
  {
    id: 'anaerobic',
    name: 'Anaerobic fermentation',
    summary:
      'Cherries or de-pulped seeds ferment in sealed tanks with no oxygen. The microbial population shifts and produces unusual compounds: cinnamon, bubblegum, tropical fruit, sometimes funk. A modern process built for competition cups.',
    stages: [
      { title: 'Harvest and sort', text: 'Only very ripe, uniform cherries are selected.', icon: 'cherry' },
      { title: 'Seal the tank', text: 'Whole cherries or de-pulped seeds go into sealed stainless tanks. CO2 is bled off through a valve.', icon: 'tank' },
      { title: 'Ferment without oxygen', text: 'For 1 to 5 days, lactic acid bacteria dominate. Temperature and pH are monitored closely.', icon: 'tank', flavourImpact: 'Produces intense, sometimes wild aromatics: cinnamon, tropical fruit, bubblegum, yoghurt-like acidity.' },
      { title: 'Dry', text: 'Fermented fruit or seeds are dried as natural, honey or washed, depending on the producer.', icon: 'sun' },
      { title: 'Rest and mill', text: 'Standard resting, hulling and grading.', icon: 'bag' },
    ],
    flavourTags: ['cinnamon', 'tropical', 'bubblegum', 'winey', 'funky'],
    commonIn: ['colombia', 'costa-rica', 'ethiopia'],
    cupCharacter: { clarity: 2, body: 4, fruitiness: 5, sweetness: 4 },
  },
  {
    id: 'wet-hulled',
    name: 'Wet-hulled (Giling Basah)',
    summary:
      'An Indonesian process adapted to humid climates. Parchment is stripped while the seed is still wet, then the bare seed finishes drying. Produces the famous earthy, heavy, low-acid Sumatran profile.',
    stages: [
      { title: 'Harvest', text: 'Small farmers pick cherries and de-pulp at home the same day.', icon: 'cherry' },
      { title: 'Short ferment', text: 'Seeds ferment overnight in buckets or bags.', icon: 'tank' },
      { title: 'Partial dry', text: 'Parchment coffee is dried briefly, only to about 30 to 35 percent moisture.', icon: 'sun' },
      { title: 'Hull wet', text: 'The soft, wet parchment is stripped off by machine, exposing the swollen green seed.', icon: 'gear', flavourImpact: 'Exposed seeds take on a distinctive blue-green colour and an earthy, herbal, full-bodied character.' },
      { title: 'Finish drying', text: 'Bare seeds dry quickly on patios to export moisture.', icon: 'sun' },
      { title: 'Grade and bag', text: 'Sorted and bagged, often with a wider range of defects than washed lots.', icon: 'bag' },
    ],
    flavourTags: ['earthy', 'herbal', 'tobacco', 'dark-chocolate', 'spice'],
    commonIn: ['indonesia'],
    cupCharacter: { clarity: 1, body: 5, fruitiness: 1, sweetness: 3 },
  },
  {
    id: 'carbonic',
    name: 'Carbonic maceration',
    summary:
      'Borrowed from Beaujolais winemaking. Whole cherries are sealed in tanks flushed with CO2 so fermentation happens inside the intact fruit. Delivers candy-like fruit and florals with a soft acidity.',
    stages: [
      { title: 'Harvest', text: 'Whole, intact cherries are selected. Any broken skin changes the fermentation.', icon: 'cherry' },
      { title: 'Flush with CO2', text: 'Cherries go into a sealed tank that is pumped full of carbon dioxide to displace all oxygen.', icon: 'tank' },
      { title: 'Intracellular fermentation', text: 'Enzymes inside each cherry convert sugars without microbes doing the work, for 2 to 7 days.', icon: 'tank', flavourImpact: 'Produces strawberry candy, rose, and a juicy, soft acidity without the funk of open-air fermentation.' },
      { title: 'Dry', text: 'The cherries are then dried whole like a natural, or de-pulped and dried as washed.', icon: 'sun' },
      { title: 'Rest and mill', text: 'Standard resting, hulling and grading.', icon: 'bag' },
    ],
    flavourTags: ['strawberry', 'rose', 'bubblegum', 'tropical'],
    commonIn: ['colombia', 'ethiopia', 'panama'],
    cupCharacter: { clarity: 3, body: 3, fruitiness: 5, sweetness: 5 },
  },
  {
    id: 'monsooned',
    name: 'Monsooned',
    summary:
      'Unique to India\'s Malabar coast. Green beans are exposed to monsoon winds and humidity for months until they swell and turn pale yellow. Acidity nearly vanishes and the cup becomes heavy, musty and spiced.',
    stages: [
      { title: 'Start with natural', text: 'Natural-processed arabica or robusta is hulled and graded as usual.', icon: 'bag' },
      { title: 'Open the warehouse', text: 'Beans are spread in open-sided warehouses facing the sea during the June to September monsoon.', icon: 'wind' },
      { title: 'Swell and pale', text: 'Over 12 to 16 weeks the beans absorb moisture, double in size and bleach to a pale gold.', icon: 'raisin', flavourImpact: 'Acidity drops to almost nothing. Body becomes thick and the flavour turns woody, musty and spiced.' },
      { title: 'Rake and rebag', text: 'Beans are raked and rebagged repeatedly so they monsoon evenly.', icon: 'hand' },
      { title: 'Re-dry and polish', text: 'Finished beans are dried back down, polished and sorted.', icon: 'sun' },
    ],
    flavourTags: ['spice', 'cedar', 'tobacco', 'molasses', 'earthy'],
    commonIn: ['india'],
    cupCharacter: { clarity: 1, body: 5, fruitiness: 1, sweetness: 3 },
  },
];
