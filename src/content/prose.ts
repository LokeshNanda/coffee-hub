import type { ProseSection } from './types';

export const prose: Record<string, ProseSection> = {
  species: {
    id: 'species',
    title: 'Arabica, robusta and the rest',
    body: `Coffee is the seed of a cherry from the *Coffea* genus. Over a hundred species exist, but only two matter commercially.

## Arabica (Coffea arabica)
- Around 60 percent of world production and nearly all specialty coffee.
- Self-pollinating, with 44 chromosomes. It is a natural hybrid of two other species that happened once in Ethiopia or South Sudan.
- Grows best between 1000 and 2300 metres in cool, stable climates. Higher altitude means slower growth, denser beans and more complex acidity.
- Roughly 1.2 percent caffeine. Sweeter, more acidic, more aromatic.
- Fragile. Susceptible to leaf rust, borer beetle, frost and heat.

## Robusta (Coffea canephora)
- Around 40 percent of production, mostly for instant coffee and commodity blends.
- Cross-pollinating, 22 chromosomes, thrives at low altitude and high heat.
- Roughly 2.2 percent caffeine, which is part of why it tastes bitter and why pests avoid it.
- Yields more per tree and resists disease. Adds body and crema to espresso blends.
- "Fine robusta" from India, Uganda and Vietnam is a growing specialty category.

## Liberica and excelsa
Large, irregular beans with smoky, woody, jackfruit-like flavours. Rare outside the Philippines, Malaysia and parts of Indonesia, but gaining interest as climate change pushes growers to heat-tolerant species.

## Why altitude matters
Cooler nights slow cherry maturation. Slower maturation means more sugar development and a harder, denser seed. Density is why high-grown coffee roasts differently and why "SHB" (strictly hard bean) and "SHG" (strictly high grown) appear on bags from Central America.`,
  },
  roastingScience: {
    id: 'roasting-science',
    title: 'What happens inside the roaster',
    body: `Roasting turns a dense, grassy green seed into something brittle, aromatic and brown. It takes 8 to 15 minutes and passes through distinct stages.

## Drying (0 to 150 °C)
Green coffee holds 10 to 12 percent water. The first minutes drive it off. The bean turns yellow and smells like hay or bread.

## Maillard reactions (150 to 200 °C)
Amino acids and sugars react to create hundreds of new aroma compounds and the brown colour. This is where body and savoury sweetness are built. Longer time here gives a rounder, heavier cup.

## First crack (around 196 °C)
Steam and CO2 pressure split the bean with an audible pop. The bean roughly doubles in volume. Anything stopped soon after this point is a light roast.

## Development (after first crack)
Caramelisation takes over. Sugars break down into bittersweet compounds, acids degrade, oils begin to move. The roaster's choice of how long to run this phase determines everything from light-medium to medium-dark.

## Second crack (around 224 °C)
The cell structure itself fractures and oils reach the surface. Roast flavours (smoke, carbon, dark cocoa) now dominate origin flavours. This is dark roast territory.

## Degassing and resting
Freshly roasted coffee is full of CO2. For filter, rest 4 to 10 days; for espresso, 7 to 21 days. Too fresh and the gas disrupts extraction. Log the roast date on every bag so you can see how your results change over the weeks.`,
  },
  water: {
    id: 'water',
    title: 'Water, ratio and extraction',
    body: `Coffee is about 98.5 percent water. The water you use and how much of it you use decide most of what ends up in the cup.

## Extraction in one paragraph
Hot water dissolves soluble compounds out of the grounds. Acids and fruity aromatics dissolve first, then sugars and caramels, then bitter and astringent compounds last. "Under-extracted" coffee stopped too early: sour, thin, salty. "Over-extracted" coffee went too far: bitter, drying, hollow. Every variable you control (grind, temperature, time, agitation, ratio) just moves you along that line.

## Ratio
Written as coffee : water by weight. 1:16 means 15 g of coffee to 240 g of water. For filter, 1:15 to 1:17 is the normal window. For espresso, ratio is dose : yield in the cup, usually 1:1.5 to 1:2.5. Weigh everything. Scoops lie.

## Temperature
- 92 to 96 °C for most filter brewing.
- Lighter roasts like it hotter; darker roasts like it cooler.
- Boiling water is fine off the kettle for light roasts once it has sat for 20 seconds.

## Minerals
Pure distilled water makes flat coffee because minerals help extraction. Very hard water makes dull, chalky coffee and scales your kettle. A total hardness around 50 to 150 ppm with some bicarbonate buffer is the target. Bottled spring waters vary wildly, so check the label; many people make brewing water by adding a pinch of magnesium and calcium salts to distilled water.

## Grind
Finer grind means more surface area, faster extraction and slower flow. It is the lever you reach for first. Change it one notch at a time and keep everything else fixed.`,
  },
  grindGuide: {
    id: 'grind-guide',
    title: 'Grinding well',
    body: `## Burr versus blade
Blade grinders chop unevenly, giving dust and boulders in the same batch. The dust over-extracts and the boulders under-extract, so the cup is bitter and sour at once. A burr grinder crushes to a consistent size. It is the single biggest upgrade in home coffee.

## Grind fresh
Ground coffee loses aromatics within minutes. Grind right before brewing.

## Retention and purging
Grinders hold back a little coffee between uses. Purge a few grams when changing beans or grind settings so yesterday's coffee is not in today's cup.

## Logging grind settings
Every grinder's scale is its own language. Record the setting as it appears on your grinder, plus the grinder name, and note what it looked like against the scale on this page. Over time your log tells you where each method sits on your own dial.`,
  },
};
