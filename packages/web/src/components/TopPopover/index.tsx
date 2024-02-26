import { Popover, PopoverProps } from 'antd';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import ModeSwitch from '../ModeSwitch';

const TopPopover = ({ children }: PopoverProps) => {
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
      placement="leftTop"
      zIndex={1}
    >
      {children}
    </Popover>
  );
};

export default memo(TopPopover);
