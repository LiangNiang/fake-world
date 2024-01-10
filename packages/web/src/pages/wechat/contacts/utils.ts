import { pinyin } from 'pinyin-pro';

import { IProfile } from '@/state/profile';

export const topS = Symbol('top');
export const starS = Symbol('star');
export const otherS = Symbol('other');

export function generateNameAnchorGroup(data: { id: IProfile['id']; name: string }[]) {
  const ANCHOR_DATA = new Map<string | symbol, any[]>([
    [topS, []],
    [starS, []],
    ['A', []],
    ['B', []],
    ['C', []],
    ['D', []],
    ['E', []],
    ['F', []],
    ['G', []],
    ['H', []],
    ['I', []],
    ['J', []],
    ['K', []],
    ['L', []],
    ['M', []],
    ['N', []],
    ['O', []],
    ['P', []],
    ['Q', []],
    ['R', []],
    ['S', []],
    ['T', []],
    ['U', []],
    ['V', []],
    ['W', []],
    ['X', []],
    ['Y', []],
    ['Z', []],
    [otherS, []],
  ]);
  for (const d of data) {
    const firstLetter = pinyin(d.name, { pattern: 'first', toneType: 'none' })[0].toUpperCase();
    if (ANCHOR_DATA.has(firstLetter)) {
      ANCHOR_DATA.get(firstLetter)!.push(d);
    } else {
      ANCHOR_DATA.get(otherS)!.push(d);
    }
  }
  return ANCHOR_DATA;
}
