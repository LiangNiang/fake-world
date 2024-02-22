import { atom } from 'recoil';

import { persistAtom } from './effects';

export const ALL_LOGIN_DEVICES = ['Windows', 'iPad', 'Mac', 'Watch', 'Desktop'] as const;

export type TLoginDevicesConfig = {
  devices: (typeof ALL_LOGIN_DEVICES)[number][];
  visible: boolean;
};

export const multipleDeviceLoginState = atom<TLoginDevicesConfig>({
  key: 'multipleDeviceLoginState',
  default: {
    devices: ['iPad'],
    visible: true,
  },
  effects_UNSTABLE: [persistAtom],
});
