import UAParser from 'ua-parser-js';

export function checkCanDirectCreateScreenshot(ua: UAParser.UAParserInstance) {
  const browser = ua.getBrowser();
  const { name, version } = browser;
  const majorVersion = parseInt(version ?? '', 10);
  let errorText;
  switch (name) {
    case 'Edge':
      if (majorVersion < 94) {
        errorText = '请升级到新版本的 Edge 浏览器';
      }
      break;
    case 'Chrome':
      if (majorVersion < 104) {
        errorText = '请升级到 Chrome > 104 或更高版本';
      }
      break;
    case 'Opera':
      if (majorVersion < 90) {
        errorText = '请升级到 Opera > 90 或更高版本';
      }
      break;
    default:
      errorText = '您的浏览器不支持直接创建截图，请使用新版的 Edge、Chrome 或 Opera 浏览器';
  }
  if (errorText) throw new Error(errorText);
}

export async function drawToCanvas(stream: MediaStream) {
  const canvas = document.createElement('canvas');
  const video = document.createElement('video');
  video.srcObject = stream;

  await video.play();

  console.dir(video);

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d')!.drawImage(video, 0, 0);

  return canvas;
}
