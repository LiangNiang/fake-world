import { InfoCircleOutlined } from '@ant-design/icons';
import { App, Button, ButtonProps, Tooltip } from 'antd';
import { saveAs } from 'file-saver';
import { noop } from 'lodash-es';
import { setRecoil } from 'recoil-nexus';
import { UAParser } from 'ua-parser-js';

import useDeviceConfig from '@/components/useDeviceConfig';
import { ModeState, modeState } from '@/state/globalConfig';
import { sleep } from '@/utils';

import { checkCanDirectCreateScreenshot, drawToCanvas } from './utils';

type Props = {
  buttonProps?: ButtonProps;
};

const ScreenshotButton = ({ buttonProps }: Props) => {
  const { message } = App.useApp();
  const { screenSize } = useDeviceConfig();

  const handleCreateScreenshot = async () => {
    setRecoil(modeState, ModeState.PREVIEW);
    const parser = new UAParser();
    try {
      checkCanDirectCreateScreenshot(parser);
    } catch (e: any) {
      message.error(e?.message);
    }
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
    console.log(canvas);
    canvas.toBlob((blob) => {
      saveAs(blob!, 'screenshot.png');
      videoTrack.stop();
      location.reload();
    });
  };

  return (
    <Tooltip title="通过浏览器录屏 API 来截图">
      <Button onClick={handleCreateScreenshot} icon={<InfoCircleOutlined />} {...buttonProps}>
        截图
      </Button>
    </Tooltip>
  );
};

export default ScreenshotButton;
