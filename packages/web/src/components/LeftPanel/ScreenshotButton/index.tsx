import { CameraOutlined } from '@ant-design/icons';
import { App, Button, ButtonProps } from 'antd';
import { saveAs } from 'file-saver';
import { noop } from 'lodash-es';
import { browserName, browserVersion } from 'react-device-detect';
import { setRecoil } from 'recoil-nexus';

import useDeviceConfig from '@/components/useDeviceConfig';
import { ModeState, modeState } from '@/state/modeState';
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
    try {
      checkCanDirectCreateScreenshot({
        browserName,
        browserVersion,
      });
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

  return <Button onClick={handleCreateScreenshot} icon={<CameraOutlined />} {...buttonProps}></Button>;
};

export default ScreenshotButton;
