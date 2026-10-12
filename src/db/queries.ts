import type { Brew, CoffeeDB } from './schema';

const byRatingThenDate = (a: Brew, b: Brew) =>
  b.rating - a.rating || b.brewedAt.localeCompare(a.brewedAt);

export async function brewsForBean(db: CoffeeDB, beanId: number): Promise<Brew[]> {
  const list = await db.brews.where('beanId').equals(beanId).toArray();
  return list.sort((a, b) => a.brewedAt.localeCompare(b.brewedAt));
}

export async function bestBrewsForBean(db: CoffeeDB, beanId: number, limit = 3): Promise<Brew[]> {
  const list = await db.brews.where('beanId').equals(beanId).toArray();
  return list.sort(byRatingThenDate).slice(0, limit);
}

export async function bestBrewPerMethod(db: CoffeeDB): Promise<Map<string, Brew>> {
  const all = await db.brews.toArray();
  const best = new Map<string, Brew>();
  for (const b of all.sort(byRatingThenDate)) {
    if (!best.has(b.methodId)) best.set(b.methodId, b);
  }
  return best;
}

export async function lastBrewForMethod(db: CoffeeDB, methodId: string): Promise<Brew | undefined> {
  const list = await db.brews.where('methodId').equals(methodId).toArray();
  return list.sort((a, b) => b.brewedAt.localeCompare(a.brewedAt))[0];
}

export async function recentBrews(db: CoffeeDB, limit = 50): Promise<Brew[]> {
  return db.brews.orderBy('brewedAt').reverse().limit(limit).toArray();
}
