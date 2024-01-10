import { App, Tabs } from 'antd';

import { MetaDataEditor } from '../MetaDataEditor';
import DeveloperOptions from './DeveloperOptions';
import QuickOperations from './QuickOperations';

const RightPanel = () => {
  return (
    <div className="flex h-screen flex-col max-lg:hidden">
      <div className="flex-1 overflow-auto border-y border-dashed border-orange-400 p-4">
        <div>
          <MetaDataEditor />
        </div>
      </div>
      <div className="p-4">
        <Tabs
          defaultActiveKey="0"
          items={[
            {
              key: '0',
              label: '快捷操作',
              children: (
                <App>
                  <QuickOperations />
                </App>
              ),
            },
            {
              key: '1',
              label: '开发者选项',
              children: (
                <App>
                  <DeveloperOptions />
                </App>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default RightPanel;
