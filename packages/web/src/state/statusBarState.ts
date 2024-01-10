import { CSSProperties } from 'react';
import { atom } from 'recoil';

import { persistAtom } from './effects';

export interface IStatusBar {
  theme?: 'light' | 'dark';
  backgroundColor?: CSSProperties['backgroundColor'];
}

export const statusBarMountNodeState = atom<HTMLElement | null>({
  key: 'statusBarMountNode',
  default: null,
});

export const statusBarHideState = atom<boolean>({
  key: 'statusBarHideState',
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const statusBarState = atom<IStatusBar>({
  key: 'statusBarState',
  default: {},
});
