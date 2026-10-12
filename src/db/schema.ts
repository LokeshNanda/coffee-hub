import Dexie, { type EntityTable } from 'dexie';

export const SCHEMA_VERSION = 1;

export interface Bean {
  id?: number;
  name: string;
  roaster?: string;
  originId?: string;
  processId?: string;
  /** 0 = lightest, 100 = darkest. */
  roastPosition: number;
  /** ISO date, yyyy-mm-dd. */
  roastDate?: string;
  varietal?: string;
  bagNotes?: string;
  archived: boolean;
  /** ISO datetime. */
  createdAt: string;
}

export interface Brew {
  id?: number;
  beanId?: number;
  methodId: string;
  device?: string;
  grinder?: string;
  grindLabel?: string;
  grindValue?: number;
  doseG: number;
  waterG?: number;
  yieldG?: number;
  tempC?: number;
  timeS?: number;
  stepTimes?: number[];
  rating: number;
  bitterness?: number;
  acidity?: number;
  sweetness?: number;
  body?: number;
  flavourTags: string[];
  notes?: string;
  nextTime?: string;
  /** ISO datetime. */
  brewedAt: string;
}

export interface Setting {
  key: string;
  value: unknown;
}

export class CoffeeDB extends Dexie {
  beans!: EntityTable<Bean, 'id'>;
  brews!: EntityTable<Brew, 'id'>;
  settings!: EntityTable<Setting, 'key'>;

  constructor(name = 'coffee-hub') {
    super(name);
    this.version(SCHEMA_VERSION).stores({
      beans: '++id, name, originId, processId, roastDate, archived, createdAt',
      brews: '++id, beanId, methodId, brewedAt, rating, [beanId+rating], [methodId+rating]',
      settings: 'key',
    });
  }
}

export const db = new CoffeeDB();
