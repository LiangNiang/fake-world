import { useRequest } from 'ahooks';
import { App, Button, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import ScreenshotButton from '@/components/LeftPanel/ScreenshotButton';
import useDeviceConfig from '@/components/useDeviceConfig';
import { imageDBManager } from '@/dataSource';
import { getRemoteDB, getShareDataSourceInfo } from '@/services';

const ShareEntry = () => {
  const { shareKey } = useParams();
  const screenConfig = useDeviceConfig();
  const [loading, setLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { notification } = App.useApp();

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
        const db = imageDBManager.getDBInstanceByKey(import.meta.env.VITE_PERSIST_STATE_SHARE_KEY);
        await db.import(remoteDB, {
          acceptNameDiff: true,
          overwriteValues: true,
        });
      }
      localStorage.setItem(import.meta.env.VITE_PERSIST_STATE_SHARE_KEY, JSON.stringify(data));
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
    const iframe = iframeRef.current;
    if (iframe) {
      const iWindow = iframe.contentWindow;
      (iWindow as Window).__SHARE_KEY__ = shareKey;
    }
  }, [loadSuccess]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex space-x-4">
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
        <Spin spinning={!loadSuccess} wrapperClassName="">
          {loadSuccess ? (
            <iframe id="screen" ref={iframeRef} width={screenConfig.width} height={screenConfig.height} src="/"></iframe>
          ) : (
            <div style={screenConfig}></div>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default ShareEntry;
