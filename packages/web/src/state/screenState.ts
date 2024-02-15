import { atom } from 'recoil';
import { setRecoil } from 'recoil-nexus';

import { persistAtom } from './effects';

window.setDevice = (v) => {
  setRecoil(deviceState, v as MOBILE_LIST);
};

export enum MOBILE_LIST {
  IPHONE_12_PRO = 'iPhone 12 Pro',
  IPHONE_14_PRO_MAX = 'iPhone 14 Pro Max',
  IPHONE_XR = 'iPhone XR',
  IPHONE_SE = 'iPhone SE',
  PIXEL = 'Pixel',
}

export const SCREEN_SIZE = {
  [MOBILE_LIST.IPHONE_14_PRO_MAX]: {
    width: '430px',
    height: '932px',
  },
  [MOBILE_LIST.IPHONE_12_PRO]: {
    width: '390px',
    height: '844px',
  },
  [MOBILE_LIST.IPHONE_XR]: {
    width: '414px',
    height: '896px',
  },
  [MOBILE_LIST.IPHONE_SE]: {
    width: '375px',
    height: '667px',
  },
  [MOBILE_LIST.PIXEL]: {
    width: '412px',
    height: '915px',
  },
};

export const deviceState = atom<MOBILE_LIST>({
  key: 'deviceState',
  default: MOBILE_LIST.IPHONE_12_PRO,
  effects_UNSTABLE: [persistAtom],
});
