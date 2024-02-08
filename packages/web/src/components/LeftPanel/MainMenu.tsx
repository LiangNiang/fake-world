import { Dropdown } from 'antd';
import { useTranslation } from 'react-i18next';

import { imageDB, imageDBManager } from '@/dataSource';

import useAppInfo from '../useAppInfo';
import DataSourceManage from './DataSourceManage';
import GenerateRandomUser from './GenerateRandomUser';
import ScreenDevicesSelect from './ScreenDevicesSelect';
import ScreenshotButton from './ScreenshotButton';

const MainMenu = () => {
  const { label, app } = useAppInfo();
  const { t } = useTranslation();

  return (
    <>
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
        <div className="grid grid-cols-2 gap-1">
          <div className="col-span-1">生成截图</div>
          <ScreenshotButton />
        </div>

        <div className="grid grid-cols-2 gap-1">
          <div className="col-span-1">生成随机好友</div>
          <GenerateRandomUser />
        </div>

        <div className="grid grid-cols-2 gap-1">
          <div className="col-span-1">数据源</div>
          <DataSourceManage />
        </div>

        <div className="grid grid-cols-2 items-center gap-1">
          <div className="col-span-1">清除数据</div>
          <Dropdown.Button
            danger
            onClick={async () => {
              localStorage.clear();
              await imageDBManager.removeAllDBs();
              window.location.reload();
            }}
            menu={{
              items: [
                {
                  key: '1',
                  label: '清空图片缓存',
                },
              ],
              onClick: async ({ key }) => {
                if (key === '1') {
                  await imageDB.images.clear();
                  window.location.reload();
                }
              },
            }}
          >
            清除所有
          </Dropdown.Button>
        </div>
      </div>
    </>
  );
};

export default MainMenu;
