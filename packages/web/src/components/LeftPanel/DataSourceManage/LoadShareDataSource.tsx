import { Button, Form, Input, message } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSetRecoilState } from 'recoil';
import { getRecoil } from 'recoil-nexus';

import { imageDBManager } from '@/dataSource';
import { getRemoteDB, getShareDataSourceInfo } from '@/services';
import { dataSourceListState } from '@/state/globalConfig';

type FormValue = { shareKey: string };

const LoadShareDataSource = () => {
  const [loading, setLoading] = useState(false);
  const setdataSourceList = useSetRecoilState(dataSourceListState);
  const [form] = Form.useForm<{ shareKey: string }>();
  const { t } = useTranslation();

  const loadShare = async (values: FormValue) => {
    setLoading(true);
    const { shareKey } = values;
    try {
      const { data: res } = await getShareDataSourceInfo(shareKey);
      const { data, downloadUrl } = res;

      if (downloadUrl) {
        const { data: buffer } = await getRemoteDB(downloadUrl);
        const remoteDB = new Blob([buffer], { type: 'text/json' });
        const db = imageDBManager.createDBInstance(shareKey);
        await db.import(remoteDB, {
          acceptNameDiff: true,
        });
      }
      localStorage.setItem(shareKey, JSON.stringify(data));
      setdataSourceList((prev) => {
        return [
          ...prev,
          {
            id: shareKey,
            type: 'share',
            isCurrent: false,
            shareKey,
          },
        ];
      });
      message.success(t('base.success'));
    } catch (err) {
      console.log(err);
      message.error(t('base.fail'));
    }
    form.resetFields();
    setLoading(false);
  };

  return (
    <div>
      <div className="text-lg font-semibold">{t('menu.dataSourceManage.loadShare.title')}</div>
      <div className="mt-4">
        <Form layout="inline" form={form} onFinish={loadShare}>
          <Form.Item
            name="shareKey"
            required
            rules={[
              { required: true, message: t('menu.dataSourceManage.loadShare.errorEmpty') },
              {
                validateTrigger: 'onSubmit',
                validator: (_, value) => {
                  if (value && getRecoil(dataSourceListState).some((item) => item.shareKey === value)) {
                    return Promise.reject(t('menu.dataSourceManage.loadShare.errorLoaded'));
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <Input placeholder={t('menu.dataSourceManage.loadShare.placeholder')} className="w-72" />
          </Form.Item>
          <Button loading={loading} htmlType="submit">
            {t('menu.dataSourceManage.loadShare.load')}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default LoadShareDataSource;
