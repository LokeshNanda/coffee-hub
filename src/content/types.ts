export type MethodFamily = 'pressure' | 'percolation' | 'immersion';

export type GrindBand = 'extra-fine' | 'fine' | 'medium-fine' | 'medium' | 'medium-coarse' | 'coarse';

export interface RecipeStep {
  title: string;
  instruction: string;
  /** Seconds. Omit for untimed steps (user taps next). */
  duration?: number;
  /** Cumulative target water in grams at the end of this step, scaled per dose. Expressed per 1 g of coffee. */
  waterPerGram?: number;
}

export interface TweakGuide {
  tooBitter: string;
  tooSour: string;
  tooWeak: string;
  tooStrong: string;
}

export interface BrewMethod {
  id: string;
  name: string;
  family: MethodFamily;
  tagline: string;
  description: string;
  deviceNotes: string;
  /** water : coffee, e.g. [15, 17]. For espresso this is yield : dose, e.g. [1.8, 2.5]. */
  ratioRange: [number, number];
  defaultRatio: number;
  usesYield: boolean;
  grind: GrindBand;
  tempRange: [number, number];
  typicalTimeS: number;
  defaultDoseG: number;
  steps: RecipeStep[];
  mistakes: string[];
  tweaks: TweakGuide;
  /** Roast slider positions this method suits, 0 = lightest, 100 = darkest. */
  roastRange: [number, number];
}

export interface Stage {
  title: string;
  text: string;
  /** Key for the illustration picker. */
  icon: string;
  flavourImpact?: string;
}

export interface ProcessingMethod {
  id: string;
  name: string;
  summary: string;
  stages: Stage[];
  flavourTags: string[];
  commonIn: string[];
  cupCharacter: { clarity: number; body: number; fruitiness: number; sweetness: number };
}

export type Region = 'africa' | 'americas' | 'asia-pacific';

export interface Origin {
  id: string;
  name: string;
  region: Region;
  altitudeM: [number, number];
  processes: string[];
  flavourTags: string[];
  /** Percent position on an equirectangular world map. */
  map: { x: number; y: number };
  varietals: string[];
  summary: string;
}

export interface RoastLevel {
  id: string;
  name: string;
  position: number;
  colour: string;
  surface: string;
  acidity: number;
  body: number;
  sweetness: number;
  bitterness: number;
  description: string;
  suits: string[];
}

export interface FlavourNode {
  id: string;
  name: string;
  colour?: string;
  children?: FlavourNode[];
}

export interface Varietal {
  id: string;
  name: string;
  species: 'arabica' | 'robusta' | 'liberica';
  origins: string[];
  notes: string;
}

export interface GrindSize {
  id: string;
  band: GrindBand;
  name: string;
  position: number;
  looksLike: string;
  suits: string[];
}

export interface ProseSection {
  id: string;
  title: string;
  /** Minimal markdown: #, ##, paragraphs, - lists, **bold**. */
  body: string;
}
