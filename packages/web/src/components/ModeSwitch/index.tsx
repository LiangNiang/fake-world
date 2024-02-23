import { Switch } from 'antd';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { ModeState } from '@/state/modeState';

import useMode from '../useMode';

const ModeSwitch = () => {
  const { t } = useTranslation();
  const { isEdit, setMode } = useMode();

  return (
    <Switch
      checkedChildren={t('base.modeEdit')}
      unCheckedChildren={t('base.modePreview')}
      checked={isEdit}
      onChange={(checked) => {
        setMode(checked ? ModeState.EDIT : ModeState.PREVIEW);
      }}
    />
  );
};

export default memo(ModeSwitch);
