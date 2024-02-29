import { atom } from 'recoil';
import { setRecoil } from 'recoil-nexus';

import { persistAtom } from './effects';

window.setDevice = (v) => {
  setRecoil(deviceState, v as MOBILE_LIST);
};

export enum MOBILE_LIST {
  AUTO = 'auto',
  IPHONE_12_PRO = 'iPhone 12 Pro',
  IPHONE_14_PRO_MAX = 'iPhone 14 Pro Max',
  IPHONE_XR = 'iPhone XR',
  IPHONE_SE = 'iPhone SE',
  PIXEL = 'Pixel',
}

export const MOBILE_LIST_LABEL = {
  [MOBILE_LIST.AUTO]: 'menu.mainBlock.device.auto',
  [MOBILE_LIST.IPHONE_14_PRO_MAX]: 'iPhone 14 Pro Max',
  [MOBILE_LIST.IPHONE_12_PRO]: 'iPhone 12 Pro',
  [MOBILE_LIST.IPHONE_XR]: 'iPhone XR',
  [MOBILE_LIST.IPHONE_SE]: 'iPhone SE',
  [MOBILE_LIST.PIXEL]: 'Pixel',
};

export const SCREEN_SIZE = {
  [MOBILE_LIST.IPHONE_14_PRO_MAX]: {
    width: 430,
    height: 932,
  },
  [MOBILE_LIST.IPHONE_12_PRO]: {
    width: 390,
    height: 844,
  },
  [MOBILE_LIST.IPHONE_XR]: {
    width: 414,
    height: 896,
  },
  [MOBILE_LIST.IPHONE_SE]: {
    width: 375,
    height: 667,
  },
  [MOBILE_LIST.PIXEL]: {
    width: 412,
    height: 915,
  },
};

export const deviceState = atom<MOBILE_LIST>({
  key: 'deviceState',
  default: MOBILE_LIST.AUTO,
  effects_UNSTABLE: [persistAtom],
});
