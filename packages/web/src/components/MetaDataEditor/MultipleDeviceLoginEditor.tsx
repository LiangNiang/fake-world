import { Checkbox, Form, Switch } from 'antd';
import { useSetRecoilState } from 'recoil';

import { ALL_LOGIN_DEVICES, multipleDeviceLoginState, TLoginDevicesConfig } from '@/state/multipleDeviceLoginState';

const MultipleDeviceLoginEditor = ({ data }: EditorProps<TLoginDevicesConfig>) => {
  const [form] = Form.useForm<TLoginDevicesConfig>();
  const setConfig = useSetRecoilState(multipleDeviceLoginState);

  const onFinish = (vaules: TLoginDevicesConfig) => {
    setConfig(vaules);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      onFinish={onFinish}
      onValuesChange={() => {
        setTimeout(() => {
          form.submit();
        });
      }}
      initialValues={data}
    >
      <Form.Item<TLoginDevicesConfig> name="visible" label="是否显示" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item<TLoginDevicesConfig> name="devices" label="选择设备">
        <Checkbox.Group options={ALL_LOGIN_DEVICES.map((v) => ({ value: v, label: v }))} />
      </Form.Item>
    </Form>
  );
};

export default MultipleDeviceLoginEditor;
