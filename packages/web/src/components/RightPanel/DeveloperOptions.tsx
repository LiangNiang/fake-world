import { App, Button } from 'antd';
import copy from 'copy-to-clipboard';
import { saveAs } from 'file-saver';
import { nanoid } from 'nanoid';
import { Link } from 'react-router-dom';
import { getRecoil, setRecoil } from 'recoil-nexus';

import { db } from '@/db';
import { allNodesState, allNodesTreeState } from '@/state/detectedNode';
import { MODE_STORAGE_KEY, ModeState, modeState } from '@/state/globalConfig';
import { MOBILE_LIST, SCREEN_SIZE } from '@/state/screenState';
import { drawToCanvas, sleep } from '@/utils';

import { exportIndexedDB, serializeScrolledData } from './utils';

const DeveloperOptions = () => {
  const { message } = App.useApp();

  const screenConfig = SCREEN_SIZE[MOBILE_LIST.IPHONE_12_PRO];

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex space-x-2">
        <Button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
        >
          清空本地缓存
        </Button>
        <Button
          onClick={async () => {
            await db.images.clear();
            window.location.reload();
          }}
        >
          清空图片缓存
        </Button>
        <Button
          onClick={async () => {
            localStorage.clear();
            await db.images.clear();
            window.location.reload();
          }}
        >
          清除所有
        </Button>
      </div>
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
        <Button
          onClick={async () => {
            setRecoil(modeState, ModeState.PREVIEW);
            const stream = await navigator.mediaDevices.getDisplayMedia({
              video: true,
              audio: false,
              preferCurrentTab: true,
            });
            await sleep(700);
            const screenElement = document.querySelector('#screen') as HTMLDivElement;
            const innerHeight = window.innerHeight;
            if (innerHeight < +screenConfig.height.slice(0, -2)) {
              screenElement.style.height = `${innerHeight}px`;
            }
            const [videoTrack] = stream.getVideoTracks();
            const cropTarget = await CropTarget.fromElement(screenElement);
            await videoTrack.cropTo(cropTarget);
            const canvas = await drawToCanvas(stream);
            canvas.toBlob((blob) => {
              saveAs(blob!, 'screenshot.png');
              videoTrack.stop();
              location.reload();
            });
          }}
        >
          截图（实验性功能）
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
