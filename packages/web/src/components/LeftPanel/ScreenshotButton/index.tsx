import { InfoCircleOutlined } from '@ant-design/icons';
import { App, Button, Tooltip } from 'antd';
import { saveAs } from 'file-saver';
import { noop } from 'lodash-es';
import { setRecoil } from 'recoil-nexus';
import { UAParser } from 'ua-parser-js';

import useDeviceConfig from '@/components/useDeviceConfig';
import { ModeState, modeState } from '@/state/globalConfig';
import { sleep } from '@/utils';

import { checkCanDirectCreateScreenshot, drawToCanvas } from './utils';

const ScreenshotButton = () => {
  const { message } = App.useApp();
  const screenSize = useDeviceConfig();

  const handleCreateScreenshot = async () => {
    setRecoil(modeState, ModeState.PREVIEW);
    const parser = new UAParser();
    try {
      checkCanDirectCreateScreenshot(parser);
    } catch (e: any) {
      message.error(e?.message);
    }
    try {
      const stream = await navigator.mediaDevices
        .getDisplayMedia({
          video: true,
          audio: false,
          preferCurrentTab: true,
        })
        .catch(noop);
      if (!stream) return;
      await sleep(700);
      const screenElement = document.querySelector('#screen') as HTMLDivElement;
      const innerHeight = window.innerHeight;
      if (innerHeight < +screenSize.height.slice(0, -2)) {
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
    } catch {
      message.error('截图失败，推荐使用新版的 Chrome 或者 Edge 浏览器重试');
    }
  };

  return (
    <Tooltip title="通过浏览器录屏 API 来截图">
      <Button onClick={handleCreateScreenshot} icon={<InfoCircleOutlined />}>
        截图
      </Button>
    </Tooltip>
  );
};

export default ScreenshotButton;
