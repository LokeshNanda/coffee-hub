export * from './types';
export { methods } from './methods';
export { processing } from './processing';
export { origins } from './origins';
export { roasts } from './roasts';
export { flavourWheel, flattenFlavours, flavourIndex } from './flavours';
export type { FlatFlavour } from './flavours';
export { varietals } from './varietals';
export { grindSizes } from './grind';
export { prose } from './prose';
export { sourcingJourney, sourcingTerms } from './sourcing';

import { methods } from './methods';
import { processing } from './processing';
import { origins } from './origins';
import { roasts } from './roasts';
import { varietals } from './varietals';
import { grindSizes } from './grind';
import { flavourIndex } from './flavours';
import type { BrewMethod, ProcessingMethod, Origin, RoastLevel, Varietal, GrindSize } from './types';

const byId = <T extends { id: string }>(list: T[]) => new Map(list.map((x) => [x.id, x]));

const methodMap = byId(methods);
const processMap = byId(processing);
const originMap = byId(origins);
const roastMap = byId(roasts);
const varietalMap = byId(varietals);
const grindMap = byId(grindSizes);

export const getMethod = (id: string): BrewMethod | undefined => methodMap.get(id);
export const getProcess = (id: string): ProcessingMethod | undefined => processMap.get(id);
export const getOrigin = (id: string): Origin | undefined => originMap.get(id);
export const getRoast = (id: string): RoastLevel | undefined => roastMap.get(id);
export const getVarietal = (id: string): Varietal | undefined => varietalMap.get(id);
export const getGrind = (id: string): GrindSize | undefined => grindMap.get(id);
export const getFlavourName = (id: string): string => flavourIndex.get(id)?.name ?? id;

/** Nearest named roast level for a slider position 0–100. */
export function roastForPosition(position: number): RoastLevel {
  return roasts.reduce((best, r) =>
    Math.abs(r.position - position) < Math.abs(best.position - position) ? r : best,
  );
}

/** Grind entry for a band name. */
export function grindForBand(band: string): GrindSize | undefined {
  return grindSizes.find((g) => g.band === band);
}
