import { Button, DatePicker, Form } from 'antd';
import dayjs from 'dayjs';
import { useSetRecoilState } from 'recoil';

import { randomFeedId } from '@/faker/wechat/moments';
import { feedState, IFeed, IFeedComment } from '@/state/moments';
import { SLATE_EMPTY_VALUE } from '@/wechatComponents/SlateText/utils';

import FriendSelect from './FriendSelect';
import SlateInput from './SlateInput';

const FeedCommentsListMetaDataEditor = ({ index }: EditorProps<IFeed['comments'], IFeed['id']>) => {
  const [form] = Form.useForm<IFeedComment>();
  const setFeed = useSetRecoilState(feedState(index));

  const onFinish = (values: IFeedComment) => {
    setFeed((prev) => ({
      ...prev,
      comments: [
        ...(prev.comments ?? []),
        {
          ...values,
          id: randomFeedId(),
        },
      ],
    }));
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      onFinish={onFinish}
      initialValues={{ text: SLATE_EMPTY_VALUE, sendTimestamp: dayjs().valueOf() }}
    >
      <Form.Item<IFeedComment> name="fromUserId" label="评论发送人" rules={[{ required: true }]}>
        <FriendSelect withMyself withQuickAdd />
      </Form.Item>
      <Form.Item<IFeedComment> name="replyUserId" label="评论回复人">
        <FriendSelect withMyself withQuickAdd allowClear />
      </Form.Item>
      <Form.Item<IFeedComment> name="text" label="评论内容">
        <SlateInput inline />
      </Form.Item>
      <Form.Item<IFeedComment>
        name="sendTimestamp"
        label="评论时间"
        rules={[{ required: true }]}
        getValueProps={(v) => {
          return {
            value: dayjs(v),
          };
        }}
        normalize={(v) => v.valueOf()}
      >
        <DatePicker showTime allowClear={false} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          创建
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FeedCommentsListMetaDataEditor;
