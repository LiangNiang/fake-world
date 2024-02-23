import { App as AntdApp, ConfigProvider, Popover } from 'antd';
import { useTranslation } from 'react-i18next';

import LeftPanel from './components/LeftPanel';
import ModeSwitch from './components/ModeSwitch';
import RightPanel from './components/RightPanel';
import Screen from './components/Screen';
import Tour from './components/Tour';
import useDeviceConfig from './components/useDeviceConfig';
import { ANTD_LANG_MAP } from './i18n';

const App = () => {
  const { screenSize } = useDeviceConfig();
  const inShareMode = !!window.__SHARE_KEY__;
  const { i18n } = useTranslation();

  return (
    <ConfigProvider locale={ANTD_LANG_MAP[i18n.language as keyof typeof ANTD_LANG_MAP]}>
      <div className="grid min-h-screen grid-cols-3 max-lg:grid-cols-1">
        {!inShareMode && (
          <AntdApp className="max-lg:hidden">
            <LeftPanel />
          </AntdApp>
        )}
        <div className="flex items-center justify-center overflow-auto border-l border-r border-dashed border-orange-400 max-lg:border-none">
          <div className="border">
            <Popover
              rootClassName="max-lg:hidden"
              open={!inShareMode}
              content={
                <div className="flex space-x-2">
                  <span>切换模式:</span>
                  <ModeSwitch />
                </div>
              }
              autoAdjustOverflow={false}
            >
              <Screen sizeConfig={screenSize} />
            </Popover>
          </div>
        </div>
        {!inShareMode && <RightPanel />}
      </div>
      <Tour />
    </ConfigProvider>
  );
};

export default App;
