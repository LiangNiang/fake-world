import { atom } from 'recoil';

import { globalConfigPersistAtom } from '../effects';

export const touredState = atom({
  key: 'touredState',
  default: false,
  effects_UNSTABLE: [globalConfigPersistAtom],
});

export const tourTargetState = atom<{
  ref1: HTMLElement | null;
  ref2: HTMLElement | null;
  ref3: HTMLElement | null;
}>({
  key: 'tourDataState',
  default: {
    ref1: null,
    ref2: null,
    ref3: null,
  },
});
