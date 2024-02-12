import { App as AntdApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import Screen from './components/Screen';
import useDeviceConfig from './components/useDeviceConfig';

const App = () => {
  const { screenSize } = useDeviceConfig();
  const inShareMode = !!window.__SHARE_KEY__;

  return (
    <ConfigProvider locale={zhCN}>
      <div className="grid min-h-screen grid-cols-3 max-lg:grid-cols-1">
        {!inShareMode && (
          <AntdApp>
            <LeftPanel />
          </AntdApp>
        )}
        <div className="flex items-center justify-center overflow-auto border-l border-r border-dashed border-orange-400 max-lg:border-none">
          <div className="border">
            <Screen sizeConfig={screenSize} />
          </div>
        </div>
        {!inShareMode && <RightPanel />}
      </div>
    </ConfigProvider>
  );
};

export default App;
