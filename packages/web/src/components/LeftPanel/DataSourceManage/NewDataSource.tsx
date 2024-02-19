import { css, Global } from '@emotion/react';
import { App, Button, Form, Input } from 'antd';
import { nanoid } from 'nanoid';
import { useTranslation } from 'react-i18next';
import { useSetRecoilState } from 'recoil';

import { imageDBManager } from '@/dataSource';
import { dataSourceListState, IDataSourceItem } from '@/state/globalConfig';

const NewDataSource = () => {
  const [form] = Form.useForm<IDataSourceItem>();
  const setDataSourceList = useSetRecoilState(dataSourceListState);
  const { message } = App.useApp();
  const { t } = useTranslation();

  const handleCreateDataSource = (values: IDataSourceItem) => {
    setDataSourceList((prev) => {
      return [
        {
          ...values,
          type: 'local',
          isCurrent: false,
        },
        ...prev,
      ];
    });
    imageDBManager.createDBInstance(values.id);
    message.success(t('base.success'));
    form.resetFields();
    form.setFieldValue('id', nanoid(8));
  };

  return (
    <div className="flex flex-col">
      <div className="text-lg font-semibold">{t('menu.dataSourceManage.new')}</div>
      <Form
        form={form}
        className="mt-4"
        initialValues={{
          id: nanoid(8),
        }}
        labelAlign="left"
        labelCol={{ span: 4 }}
        onFinish={handleCreateDataSource}
      >
        <Global
          styles={css`
            input[readonly] {
              padding-left: 0;
            }
          `}
        />
        <Form.Item tooltip={t('menu.dataSourceManage.autoGenerate')} label="ID" name="id">
          <Input readOnly variant="borderless" />
        </Form.Item>
        <Form.Item label={t('menu.dataSourceManage.name')} name="name" required rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary">
            {t('menu.dataSourceManage.create')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NewDataSource;
