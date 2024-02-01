import { Button, Form, Input, InputNumber, Radio, Switch } from 'antd';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { useSetRecoilState } from 'recoil';
import { getRecoil } from 'recoil-nexus';

import { conversationState, EConversationRole, EConversationType, fromLastGenerateUpperText, TConversationItem } from '@/state/conversationState';
import { IFeed } from '@/state/moments';
import { SLATE_INITIAL_VALUE } from '@/wechatComponents/SlateText/utils';

import LocalImageUploadWithPreview from '../LocalImageUpload';
import WrapSlateInput from '../SlateInput';
import { CONVERSATION_TYPE_OPTIONS } from './consts';

const ConversationListMetaDataEditor = ({ index }: EditorProps<unknown, IFeed['id']>) => {
  const [form] = Form.useForm<TConversationItem>();
  const setConversation = useSetRecoilState(conversationState(index));

  const onFinish = (values: TConversationItem) => {
    setConversation((prev) => {
      return [
        ...prev,
        {
          ...values,
          id: nanoid(8),
          sendTimestamp: dayjs().valueOf(),
        },
      ] as TConversationItem[];
    });
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      onFinish={onFinish}
      initialValues={{
        type: EConversationType.text,
        role: EConversationRole.mine,
        textContent: SLATE_INITIAL_VALUE,
        simpleContent: '',
      }}
    >
      <Form.Item<TConversationItem> name="type" label="消息类型">
        <Radio.Group options={CONVERSATION_TYPE_OPTIONS}></Radio.Group>
      </Form.Item>
      <Form.Item<TConversationItem> name="role" label="消息由谁发送">
        <Radio.Group>
          <Radio value={EConversationRole.mine}>我自己</Radio>
          <Radio value={EConversationRole.friend}>朋友</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item<TConversationItem> name="upperText" label="上方文字">
        <Input
          suffix={
            <Button
              onClick={() => {
                const conversationList = getRecoil(conversationState(index));
                form.setFieldValue('upperText', fromLastGenerateUpperText(conversationList));
              }}
            >
              自动生成时间文本
            </Button>
          }
        />
      </Form.Item>
      <Form.Item<TConversationItem> noStyle shouldUpdate={(pv, cv) => pv.type !== cv.type}>
        {({ getFieldValue, setFieldValue }) => {
          const type = getFieldValue('type');
          if (type === EConversationType.text) {
            return (
              <Form.Item<TConversationItem> name="textContent" label="聊天内容">
                <WrapSlateInput inline />
              </Form.Item>
            );
          }
          if (type === EConversationType.centerText) {
            return (
              <Form.Item<TConversationItem> name="simpleContent" label="居中文本内容">
                <Input />
              </Form.Item>
            );
          }
          if (type === EConversationType.image) {
            return (
              <Form.Item<TConversationItem> name="imageInfo" label="图片">
                <LocalImageUploadWithPreview />
              </Form.Item>
            );
          }
          if (type === EConversationType.video) {
            return (
              <Form.Item<TConversationItem> name="videoInfo" label="视频" tooltip="视频和图片一样，仅仅只是展示的时候加一个播放图标">
                <LocalImageUploadWithPreview />
              </Form.Item>
            );
          }
          if (type === EConversationType.voice) {
            return (
              <>
                <Form.Item<TConversationItem> name="duration" label="语音时长" required rules={[{ required: true }]}>
                  <InputNumber min={1} suffix="秒" />
                </Form.Item>
                <Form.Item<TConversationItem>
                  name="isRead"
                  label="语音消息是否已读"
                  valuePropName="checked"
                  tooltip="只有是好友发送的消息才会显示未读小红点"
                >
                  <Switch />
                </Form.Item>
                <Form.Item<TConversationItem> name="showStt" label="是否跟随显示语音转文字内容" valuePropName="checked">
                  <Switch />
                </Form.Item>
                <Form.Item<TConversationItem> name="stt" label="语音转文字内容">
                  <Input />
                </Form.Item>
              </>
            );
          }
          if (type === EConversationType.transfer) {
            return (
              <>
                <Form.Item<TConversationItem> name="originalSender" label="转账发起人" required rules={[{ required: true }]}>
                  <Radio.Group>
                    <Radio value={EConversationRole.mine}>我自己</Radio>
                    <Radio value={EConversationRole.friend}>朋友</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item<TConversationItem> name="amount" label="转账金额" required rules={[{ required: true }]}>
                  <Input
                    addonBefore="¥"
                    suffix={
                      <Button
                        onClick={() => {
                          const amount = getFieldValue('amount');
                          const amountNumber = parseFloat(amount);
                          if (isNaN(amountNumber)) return;
                          setFieldValue('amount', amountNumber.toFixed(2));
                        }}
                      >
                        格式化金额
                      </Button>
                    }
                  />
                </Form.Item>
                <Form.Item<TConversationItem> name="note" label="转账说明" tooltip="只有在转账状态是等待接受的时候转账说明才会显示">
                  <Input />
                </Form.Item>
                <Form.Item<TConversationItem> name="transferStatus" label="转账状态" required rules={[{ required: true }]}>
                  <Radio.Group>
                    <Radio value="awaiting">等待领取</Radio>
                    <Radio value="accepted">已接受</Radio>
                    <Radio value="rejected">已退还</Radio>
                    <Radio value="exexpired">已过期</Radio>
                  </Radio.Group>
                </Form.Item>
              </>
            );
          }
          if (type === EConversationType.redPacket) {
            return (
              <>
                <Form.Item<TConversationItem> name="originalSender" label="红包发起人" required rules={[{ required: true }]}>
                  <Radio.Group>
                    <Radio value={EConversationRole.mine}>我自己</Radio>
                    <Radio value={EConversationRole.friend}>朋友</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item<TConversationItem> name="amount" label="红包金额" tooltip="并不会直接展示出来">
                  <Input addonBefore="¥" />
                </Form.Item>
                <Form.Item<TConversationItem> name="note" label="红包说明" tooltip="只有在红包状态是等待领取的时候说明才会显示">
                  <Input />
                </Form.Item>
                <Form.Item<TConversationItem> name="redPacketStatus" label="红包状态" required rules={[{ required: true }]}>
                  <Radio.Group>
                    <Radio value="awaiting">等待领取</Radio>
                    <Radio value="accepted">已接受</Radio>
                    <Radio value="expired">已过期</Radio>
                  </Radio.Group>
                </Form.Item>
              </>
            );
          }
        }}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          创建
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ConversationListMetaDataEditor;
