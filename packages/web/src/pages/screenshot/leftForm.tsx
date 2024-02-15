import { App, Button, Form, Image, Input } from 'antd';
import { ChangeEventHandler, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { ENV_API_BASE_URL } from '@/consts';

import { file2Blob } from './utils';

interface FormValues {
  data: string;
  file: File;
}

const FileInput = ({ onChange }: { onChange?: (v: File) => void; value?: File }) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (ev) => {
    const file = ev.target.files?.item(0);
    file && onChange?.(file);
  };
  return <Input type="file" multiple={false} onChange={handleChange} />;
};

const LeftForm = ({ className }: { className?: string }) => {
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const [currentScreenshot, setCurrentScreenshot] = useState<string | null>(null);
  const { message } = App.useApp();

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    const newBody = new FormData();
    const { data, file } = values;
    newBody.append('data', data as string);
    if (file) {
      const fb = await file2Blob(file);
      newBody.append('file', fb);
    }
    try {
      const image = await fetch(`${ENV_API_BASE_URL}/api/v1/screenshot`, {
        method: 'POST',
        body: newBody,
      }).then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.blob();
      });
      setCurrentScreenshot(URL.createObjectURL(image));
      message.success('生成成功！');
    } catch (err) {
      console.error(err);
      message.error('生成失败！');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={twMerge('flex flex-1 flex-col', className)}>
      <div className="text-xl">
        <span className="ml-2">生成截图</span>
      </div>
      <Form form={form} layout="vertical" className="mt-4" onFinish={handleSubmit}>
        <Form.Item<FormValues> name="data" label="数据" rules={[{ required: true }]}>
          <Input.TextArea rows={5} />
        </Form.Item>
        <Form.Item<FormValues> name="file" label="数据文件">
          <FileInput />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            提交
          </Button>
        </Form.Item>
      </Form>
      {currentScreenshot && (
        <div className="flex-1 overflow-hidden">
          <Image src={currentScreenshot} rootClassName="h-full" className="!h-full" />
        </div>
      )}
    </div>
  );
};

export default LeftForm;
