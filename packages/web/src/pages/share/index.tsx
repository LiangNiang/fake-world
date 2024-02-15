import { useRequest } from 'ahooks';
import { App, Button, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import ScreenDevicesSelect from '@/components/LeftPanel/ScreenDevicesSelect';
import ScreenshotButton from '@/components/LeftPanel/ScreenshotButton';
import useDeviceConfig from '@/components/useDeviceConfig';
import { ENV_SHARE_KEY } from '@/consts';
import { imageDBManager } from '@/dataSource';
import { getRemoteDB, getShareDataSourceInfo } from '@/services';

const ShareEntry = () => {
  const { shareKey } = useParams();
  const { screenSize, device } = useDeviceConfig();
  const [loading, setLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { notification } = App.useApp();
  const { t } = useTranslation();

  const { loading: loadShareLoading } = useRequest(getShareDataSourceInfo, {
    defaultParams: [shareKey],
    onBefore: () => {
      setLoading(true);
    },
    onSuccess: async (res) => {
      const { data, downloadUrl } = res.data;
      if (downloadUrl) {
        const { data: buffer } = await getRemoteDB(downloadUrl);
        const remoteDB = new Blob([buffer], { type: 'text/json' });
        const db = imageDBManager.getDBInstanceByKey(ENV_SHARE_KEY);
        await db.import(remoteDB, {
          acceptNameDiff: true,
          overwriteValues: true,
        });
      }
      localStorage.setItem(ENV_SHARE_KEY, JSON.stringify(data));
      setLoading(false);
    },
    onError: () => {
      notification.error({
        message: '获取分享数据失败',
      });
    },
  });
  const loadSuccess = !loading && !loadShareLoading;

  useEffect(() => {
    // 监听 iframe 加载完成
    const iWindow = iframeRef.current?.contentWindow;
    const loadFn = () => {
      iWindow?.setDevice(device);
    };

    if (iWindow) {
      iWindow.__SHARE_KEY__ = shareKey;
      iWindow.addEventListener('load', loadFn);
    }

    return () => {
      iWindow?.removeEventListener('load', loadFn);
    };
  }, [loadSuccess]);

  return (
    <div className="relative flex h-screen w-screen items-center justify-center">
      <div className="absolute left-4 top-4 flex w-72 flex-col space-y-4">
        <div className="grid grid-cols-2 items-center gap-1">
          <Button
            className="w-fit"
            onClick={() => {
              location.href = '/';
            }}
          >
            退出分享模式
          </Button>
          <ScreenshotButton buttonProps={{ type: 'primary', disabled: !loadSuccess }} />
        </div>
        <div className="grid grid-cols-2 items-center gap-1">
          <div className="col-span-1">{t('base.csd')}</div>
          <ScreenDevicesSelect onChange={(v) => iframeRef.current?.contentWindow?.setDevice(v)} />
        </div>
      </div>
      <div className="flex flex-col items-center space-y-4">
        <Spin spinning={!loadSuccess} wrapperClassName="">
          {loadSuccess ? (
            <iframe id="screen" ref={iframeRef} width={screenSize.width} height={screenSize.height} src="/"></iframe>
          ) : (
            <div style={screenSize}></div>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default ShareEntry;
