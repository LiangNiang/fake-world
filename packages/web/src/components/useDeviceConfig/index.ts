import { useRecoilValue } from 'recoil';

import { deviceState, SCREEN_SIZE } from '@/state/screenState';

export default function useDeviceConfig() {
  const device = useRecoilValue(deviceState);
  const screenSize = SCREEN_SIZE[device];
  return screenSize;
}
