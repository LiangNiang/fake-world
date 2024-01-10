import { useRecoilState } from 'recoil';

import { ModeState, modeState } from '@/state/globalConfig';

export default function useMode() {
  const [mode, setMode] = useRecoilState(modeState);

  return {
    mode,
    isEdit: mode === ModeState.EDIT,
    isPreview: mode === ModeState.PREVIEW,
    setMode,
  };
}
