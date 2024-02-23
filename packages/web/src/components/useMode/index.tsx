import { useRecoilState } from 'recoil';

import { ModeState, modeState } from '@/state/modeState';

export default function useMode() {
  const [mode, setMode] = useRecoilState(modeState);

  return {
    mode,
    isEdit: mode === ModeState.EDIT,
    isPreview: mode === ModeState.PREVIEW,
    setMode,
  };
}
