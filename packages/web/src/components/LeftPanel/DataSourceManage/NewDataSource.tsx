import { css, Global } from '@emotion/react';
import { App, Button, Form, Input } from 'antd';
import { nanoid } from 'nanoid';
import { useSetRecoilState } from 'recoil';

import { DBManager } from '@/dataSource';
import { dataSourceListState, IDataSourceItem } from '@/state/globalConfig';

const NewDataSource = () => {
  const [form] = Form.useForm<IDataSourceItem>();
  const setDataSourceList = useSetRecoilState(dataSourceListState);
  const { message } = App.useApp();

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
    DBManager.getInstace().createDBInstance(values.id);
    message.success('创建成功');
    form.resetFields();
    form.setFieldValue('id', nanoid());
  };

  return (
    <div className="flex flex-col">
      <div className="text-lg font-semibold">新建数据源</div>
      <Form
        form={form}
        className="mt-4"
        initialValues={{
          id: nanoid(),
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
        <Form.Item tooltip="自动生成" label="ID" name="id">
          <Input readOnly variant="borderless" />
        </Form.Item>
        <Form.Item label="名字" name="name" required rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary">
            创建
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NewDataSource;
