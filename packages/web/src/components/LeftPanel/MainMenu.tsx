import { useTranslation } from 'react-i18next';

import useAppInfo from '../useAppInfo';
import ScreenDevicesSelect from './ScreenDevicesSelect';

const MainMenu = () => {
  const { label, app } = useAppInfo();
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-1">
        <div className="col-span-1">{t('base.curApp')}</div>
        <div>{app?.name}</div>
      </div>
      <div className="grid grid-cols-2 gap-1">
        <div className="col-span-1">{t('base.curPage')}</div>
        <div>{label}</div>
      </div>
      <div className="grid grid-cols-2 gap-1">
        <div className="col-span-1">{t('base.csd')}</div>
        <ScreenDevicesSelect />
      </div>
    </div>
  );
};

export default MainMenu;
