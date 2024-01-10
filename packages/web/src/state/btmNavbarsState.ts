import { atom } from 'recoil';

import { persistAtom } from './effects';

export enum BottomNavBars {
  WECHAT = 'WECHAT',
  ADDRESS_BOOK = 'ADDRESS_BOOK',
  DISCOVER = 'DISCOVER',
  MY = 'MY',
}

export interface IBottomNavbarItemConfig {
  badgeHide?: boolean;
  badgeNumber?: number;
  badgeType?: 'number' | 'dot';
  activated?: boolean;
}

export type BottomNavbarConfig = {
  [key in BottomNavBars]: IBottomNavbarItemConfig;
};

const INIT_VALUE: BottomNavbarConfig = {
  [BottomNavBars.WECHAT]: {
    badgeHide: false,
    badgeNumber: 22,
  },
  [BottomNavBars.ADDRESS_BOOK]: {},
  [BottomNavBars.DISCOVER]: {
    badgeType: 'dot',
  },
  [BottomNavBars.MY]: {},
};

const btmNavbarsState = atom<typeof INIT_VALUE>({
  key: 'btmNavbarsState',
  default: INIT_VALUE,
  effects_UNSTABLE: [persistAtom],
});

export default btmNavbarsState;
