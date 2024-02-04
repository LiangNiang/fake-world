import { css, Global } from '@emotion/react';
import { Form, Input } from 'antd';
import { nanoid } from 'nanoid';
import { useRef } from 'react';

import { IDataSourceItem } from '@/state/globalConfig';

const NewDataSource = () => {
  const [form] = Form.useForm<IDataSourceItem>();
  const id = useRef(nanoid());

  return (
    <div className="flex flex-col">
      <div className="text-lg font-semibold">新建数据源</div>
      <Form
        form={form}
        className="mt-4"
        initialValues={{
          id: id.current,
        }}
        labelAlign="left"
        labelCol={{ span: 4 }}
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
      </Form>
    </div>
  );
};

export default NewDataSource;
