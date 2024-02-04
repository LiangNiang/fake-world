import { Dropdown } from 'antd';
import { useTranslation } from 'react-i18next';

import { db } from '@/db';

import useAppInfo from '../useAppInfo';
import ScreenDevicesSelect from './ScreenDevicesSelect';
import ScreenshotButton from './ScreenshotButton';

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
      <div className="grid grid-cols-2 items-center gap-1">
        <div className="col-span-1">{t('base.csd')}</div>
        <ScreenDevicesSelect />
      </div>
      <div className="grid grid-cols-2 items-center gap-1">
        <div className="col-span-1">清除数据</div>
        <Dropdown.Button
          onClick={async () => {
            localStorage.clear();
            await db.images.clear();
            window.location.reload();
          }}
          menu={{
            items: [
              {
                key: '1',
                label: '清空本地缓存',
              },
              {
                key: '2',
                label: '清空图片缓存',
              },
            ],
            onClick: async ({ key }) => {
              if (key === '1') {
                localStorage.clear();
                window.location.reload();
              }
              if (key === '2') {
                await db.images.clear();
                window.location.reload();
              }
            },
          }}
        >
          清除所有
        </Dropdown.Button>
      </div>
      <div className="flex">
        <ScreenshotButton />
      </div>
    </div>
  );
};

export default MainMenu;
