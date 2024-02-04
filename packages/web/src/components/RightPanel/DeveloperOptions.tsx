import { App, Button } from 'antd';
import copy from 'copy-to-clipboard';
import { saveAs } from 'file-saver';
import { nanoid } from 'nanoid';
import { Link } from 'react-router-dom';
import { getRecoil } from 'recoil-nexus';

import { allNodesState, allNodesTreeState } from '@/state/detectedNode';
import { MODE_STORAGE_KEY } from '@/state/globalConfig';

import { exportIndexedDB, serializeScrolledData } from './utils';

const DeveloperOptions = () => {
  const { message } = App.useApp();

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex space-x-2">
        <Button
          onClick={() => {
            console.log('%c allNodesState', 'background:#1677ff; font-size: 24px; color: #fff;', getRecoil(allNodesState));
            console.log('%c allNodesTreeState', 'background:#1677ff; font-size: 24px; color: #fff;', getRecoil(allNodesTreeState));
          }}
        >
          打印所有 DetectedNode 信息
        </Button>
      </div>
      <div className="flex space-x-2">
        <Button
          onClick={async () => {
            const scrolledData = serializeScrolledData();
            const tempLocalStorage: Record<string, any> = { ...localStorage, scrolledData: JSON.stringify(scrolledData) };
            tempLocalStorage.href = location.href;
            const keysToIgnore = [MODE_STORAGE_KEY];
            keysToIgnore.forEach((k) => {
              delete tempLocalStorage[k];
            });
            copy(JSON.stringify(tempLocalStorage));
            message.success('数据已复制到剪贴板');
            const db = await exportIndexedDB();
            if (db !== null) {
              saveAs(db, `web.local.${nanoid(5)}.db`);
              message.success('数据库已导出');
            }
          }}
        >
          导出数据（实验性功能）
        </Button>
      </div>
      <div className="flex space-x-2">
        <Link to="/screenshot" className="py-2" target="_blank">
          去往生成截图
        </Link>
      </div>
    </div>
  );
};

export default DeveloperOptions;
