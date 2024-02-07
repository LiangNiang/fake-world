import { Button, Form, Input, message } from 'antd';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { getRecoil } from 'recoil-nexus';

import { DBManager } from '@/dataSource';
import { getRemoteDB, getShareDataSourceInfo } from '@/services';
import { dataSourceListState } from '@/state/globalConfig';

type FormValue = { shareId: string };

const LoadShareDataSource = () => {
  const [loading, setLoading] = useState(false);
  const setdataSourceList = useSetRecoilState(dataSourceListState);
  const [form] = Form.useForm<{ shareId: string }>();

  const loadShare = async (values: FormValue) => {
    setLoading(true);
    const { shareId } = values;
    try {
      const { data: res } = await getShareDataSourceInfo(shareId);
      const { data, shareKey, downloadUrl } = res;

      localStorage.setItem(shareKey, JSON.stringify(data));
      if (downloadUrl) {
        const { data: buffer } = await getRemoteDB(downloadUrl);
        const remoteDB = new Blob([buffer], { type: 'text/json' });
        const db = DBManager.getInstace().createDBInstance(shareKey);
        await db.import(remoteDB, {
          acceptNameDiff: true,
        });
      }
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
      message.success('加载成功');
    } catch (err) {
      console.log(err);
      message.error('加载失败');
    }
    form.resetFields();
    setLoading(false);
  };

  return (
    <div>
      <div className="text-lg font-semibold">加载外部分享数据源</div>
      <div className="mt-4">
        <Form layout="inline" form={form} onFinish={loadShare}>
          <Form.Item
            name="shareId"
            required
            rules={[
              { required: true, message: '分享 ID 不能为空' },
              {
                validateTrigger: 'onSubmit',
                validator: (_, value) => {
                  if (value && getRecoil(dataSourceListState).some((item) => item.shareKey === value)) {
                    return Promise.reject('该数据源已经加载过了');
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <Input placeholder="请输入数据源分享 ID" className="w-72" />
          </Form.Item>
          <Button loading={loading} htmlType="submit">
            加载
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default LoadShareDataSource;
