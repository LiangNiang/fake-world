import { Popover } from 'antd';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import ModeSwitch from '../ModeSwitch';

const TopPopover = () => {
  const inShareMode = !!window.__SHARE_KEY__;
  const { t } = useTranslation();

  return (
    <Popover
      rootClassName="max-lg:hidden"
      open={!inShareMode}
      content={
        <div className="flex space-x-2">
          <span>{t('base.switchMode')}</span>
          <ModeSwitch />
        </div>
      }
      autoAdjustOverflow={false}
      placement="topLeft"
      zIndex={1}
    >
      <div className="top-0" />
    </Popover>
  );
};

export default memo(TopPopover);
