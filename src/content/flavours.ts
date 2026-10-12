import type { FlavourNode } from './types';

export const flavourWheel: FlavourNode[] = [
  {
    id: 'fruity',
    name: 'Fruity',
    colour: '#d94f4f',
    children: [
      {
        id: 'berry',
        name: 'Berry',
        children: [
          { id: 'blueberry', name: 'Blueberry' },
          { id: 'strawberry', name: 'Strawberry' },
          { id: 'raspberry', name: 'Raspberry' },
          { id: 'blackcurrant', name: 'Blackcurrant' },
        ],
      },
      {
        id: 'citrus',
        name: 'Citrus',
        children: [
          { id: 'lemon', name: 'Lemon' },
          { id: 'lime', name: 'Lime' },
          { id: 'grapefruit', name: 'Grapefruit' },
          { id: 'orange', name: 'Orange' },
          { id: 'bergamot', name: 'Bergamot' },
        ],
      },
      {
        id: 'stone-fruit',
        name: 'Stone fruit',
        children: [
          { id: 'peach', name: 'Peach' },
          { id: 'apricot', name: 'Apricot' },
          { id: 'plum', name: 'Plum' },
          { id: 'cherry', name: 'Cherry' },
        ],
      },
      {
        id: 'tropical',
        name: 'Tropical',
        children: [
          { id: 'mango', name: 'Mango' },
          { id: 'pineapple', name: 'Pineapple' },
          { id: 'passion-fruit', name: 'Passion fruit' },
          { id: 'lychee', name: 'Lychee' },
        ],
      },
      {
        id: 'apple',
        name: 'Apple & pear',
        children: [
          { id: 'green-apple', name: 'Green apple' },
          { id: 'red-apple', name: 'Red apple' },
          { id: 'pear', name: 'Pear' },
        ],
      },
      {
        id: 'dried-fruit',
        name: 'Dried fruit',
        children: [
          { id: 'raisin', name: 'Raisin' },
          { id: 'date', name: 'Date' },
          { id: 'fig', name: 'Fig' },
          { id: 'prune', name: 'Prune' },
        ],
      },
      { id: 'tomato', name: 'Tomato' },
    ],
  },
  {
    id: 'floral',
    name: 'Floral',
    colour: '#c76aa8',
    children: [
      { id: 'jasmine', name: 'Jasmine' },
      { id: 'rose', name: 'Rose' },
      { id: 'chamomile', name: 'Chamomile' },
      { id: 'lavender', name: 'Lavender' },
      { id: 'honeysuckle', name: 'Honeysuckle' },
      { id: 'elderflower', name: 'Elderflower' },
    ],
  },
  {
    id: 'sweet',
    name: 'Sweet',
    colour: '#e0a434',
    children: [
      { id: 'brown-sugar', name: 'Brown sugar' },
      { id: 'honey', name: 'Honey' },
      { id: 'caramel', name: 'Caramel' },
      { id: 'toffee', name: 'Toffee' },
      { id: 'molasses', name: 'Molasses' },
      { id: 'vanilla', name: 'Vanilla' },
      { id: 'maple', name: 'Maple syrup' },
    ],
  },
  {
    id: 'nutty-cocoa',
    name: 'Nutty & cocoa',
    colour: '#9c6a3c',
    children: [
      {
        id: 'nutty',
        name: 'Nutty',
        children: [
          { id: 'almond', name: 'Almond' },
          { id: 'hazelnut', name: 'Hazelnut' },
          { id: 'peanut', name: 'Peanut' },
          { id: 'walnut', name: 'Walnut' },
        ],
      },
      {
        id: 'cocoa',
        name: 'Cocoa',
        children: [
          { id: 'chocolate', name: 'Chocolate' },
          { id: 'milk-chocolate', name: 'Milk chocolate' },
          { id: 'dark-chocolate', name: 'Dark chocolate' },
          { id: 'cacao-nib', name: 'Cacao nib' },
        ],
      },
    ],
  },
  {
    id: 'spice',
    name: 'Spice',
    colour: '#b5452c',
    children: [
      { id: 'cinnamon', name: 'Cinnamon' },
      { id: 'clove', name: 'Clove' },
      { id: 'pepper', name: 'Black pepper' },
      { id: 'cardamom', name: 'Cardamom' },
      { id: 'nutmeg', name: 'Nutmeg' },
    ],
  },
  {
    id: 'roasted',
    name: 'Roasted',
    colour: '#5c3b2a',
    children: [
      { id: 'smoky', name: 'Smoky' },
      { id: 'tobacco', name: 'Tobacco' },
      { id: 'cereal', name: 'Cereal / malt' },
      { id: 'toast', name: 'Toast' },
      { id: 'burnt', name: 'Burnt / ashy' },
    ],
  },
  {
    id: 'earthy-herbal',
    name: 'Earthy & herbal',
    colour: '#5f7a3a',
    children: [
      { id: 'earthy', name: 'Earthy' },
      { id: 'herbal', name: 'Herbal' },
      { id: 'cedar', name: 'Cedar / wood' },
      { id: 'black-tea', name: 'Black tea' },
      { id: 'green', name: 'Green / vegetal' },
      { id: 'mushroom', name: 'Mushroom' },
    ],
  },
  {
    id: 'fermented',
    name: 'Fermented',
    colour: '#7b4b9c',
    children: [
      { id: 'winey', name: 'Winey' },
      { id: 'red-wine', name: 'Red wine' },
      { id: 'funky', name: 'Funky' },
      { id: 'bubblegum', name: 'Bubblegum' },
      { id: 'boozy', name: 'Boozy / rum' },
      { id: 'yoghurt', name: 'Yoghurt' },
    ],
  },
];

/** Flatten the wheel into a map of id to node, with parent chain. */
export interface FlatFlavour {
  id: string;
  name: string;
  path: string[];
  colour: string;
  depth: number;
}

export function flattenFlavours(nodes: FlavourNode[] = flavourWheel): FlatFlavour[] {
  const out: FlatFlavour[] = [];
  const walk = (node: FlavourNode, path: string[], colour: string) => {
    const c = node.colour ?? colour;
    out.push({ id: node.id, name: node.name, path, colour: c, depth: path.length });
    node.children?.forEach((child) => walk(child, [...path, node.id], c));
  };
  nodes.forEach((n) => walk(n, [], n.colour ?? '#888'));
  return out;
}

export const flavourIndex: Map<string, FlatFlavour> = new Map(flattenFlavours().map((f) => [f.id, f]));
