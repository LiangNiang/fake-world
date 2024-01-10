import { atom } from 'recoil';

import { globalConfigPersistAtom } from '../effects';

export enum ModeState {
  EDIT = 'edit',
  PREVIEW = 'preview',
}

export const MODE_STORAGE_KEY = 'modeState';

export const modeState = atom<ModeState>({
  key: 'modeState',
  default: ModeState.PREVIEW,
  effects_UNSTABLE: [globalConfigPersistAtom],
});
