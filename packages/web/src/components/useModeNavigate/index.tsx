import { noop } from 'lodash-es';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { getRecoil } from 'recoil-nexus';

import { ModeState, modeState } from '@/state/modeState';
import { showToast } from '@/wechatComponents/Toast';

type Options = {
  errorMsg?: string;
  silence?: boolean;
};

export default function useModeNavigate(options?: Options): NavigateFunction {
  const { t, i18n } = useTranslation();
  const { errorMsg = t('base.safeNavigateNotice'), silence = false } = options ?? {};
  const baseNavigate = useNavigate();

  const navigate = useCallback(
    (...args: Parameters<NavigateFunction>) => {
      const mode = getRecoil(modeState);
      if (mode === ModeState.EDIT) {
        !silence &&
          showToast({
            type: 'error',
            content: errorMsg,
          });
        return noop;
      } else {
        return baseNavigate(...args);
      }
    },
    [i18n.language]
  );

  return navigate as NavigateFunction;
}
