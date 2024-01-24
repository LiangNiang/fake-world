import { Form, Input, InputNumber, Radio, Select } from 'antd';
import { keys } from 'lodash-es';
import { useSetRecoilState } from 'recoil';

import { IProfile, MOMENTS_PRIVACY_TEXT_MAP, myProfileState } from '@/state/profile';

import LocalImageUploadWithPreview from '../LocalImageUpload';

const MyProfileMetaDataEditor = ({ data }: EditorProps<IProfile>) => {
  const setMyProfile = useSetRecoilState(myProfileState);

  const [form] = Form.useForm();

  const onFinish = (values: IProfile) => {
    setMyProfile((prev) => ({
      ...prev,
      ...values,
    }));
  };

  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      initialValues={data}
      onFinish={onFinish}
      onValuesChange={() => {
        setTimeout(() => {
          form.submit();
        });
      }}
    >
      <Form.Item<IProfile> name="avatarInfo" label="头像">
        <LocalImageUploadWithPreview />
      </Form.Item>
      <Form.Item<IProfile> name="nickname" label="昵称" required rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item<IProfile> name="wechat" label="微信号" required rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item<IProfile> name="momentsBackgroundInfo" label="朋友圈背景图">
        <LocalImageUploadWithPreview />
      </Form.Item>
      <Form.Item<IProfile> name="momentsPrivacy" label="允许朋友查看朋友圈的范围">
        <Select
          options={keys(MOMENTS_PRIVACY_TEXT_MAP).map((k) => ({
            label: MOMENTS_PRIVACY_TEXT_MAP[k as keyof typeof MOMENTS_PRIVACY_TEXT_MAP],
            value: k,
          }))}
        />
      </Form.Item>
      <Form.Item<IProfile> name="signature" label="个性签名">
        <Input />
      </Form.Item>
      <Form.Item<IProfile> name="gender" label="性别">
        <Radio.Group>
          <Radio value="male">男</Radio>
          <Radio value="female">女</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item<IProfile> name="area" label="地区">
        <Input />
      </Form.Item>
      <Form.Item<IProfile> name="tickleText" label="拍一拍文本">
        <Input addonBefore="朋友拍了拍我" />
      </Form.Item>
      <Form.Item<IProfile> name="coin" label="微信豆个数">
        <InputNumber min={0} />
      </Form.Item>
    </Form>
  );
};

export default MyProfileMetaDataEditor;
