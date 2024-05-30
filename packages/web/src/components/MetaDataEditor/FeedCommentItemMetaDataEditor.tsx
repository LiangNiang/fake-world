import { DatePicker, Form } from "antd";
import dayjs from "dayjs";
import { useSetRecoilState } from "recoil";

import { type IFeed, type IFeedComment, feedState } from "@/state/moments";

import FriendSelect from "./FriendSelect";
import SlateInput from "./SlateInput";

const FeedCommentItemMetaDataEditor = ({
	data,
	index,
}: EditorProps<IFeedComment, [IFeed["id"], IFeedComment["id"]]>) => {
	const [feedId, commentId] = index;

	const [form] = Form.useForm<IFeedComment>();
	const setFeed = useSetRecoilState(feedState(feedId));

	const onFinish = (values: IFeedComment) => {
		setFeed((prev) => ({
			...prev,
			comments: prev.comments?.map((comment) =>
				comment.id === commentId ? { ...comment, ...values } : comment,
			),
		}));
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
				}, 100);
			}}
			initialValues={data}
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
		</Form>
	);
};

export default FeedCommentItemMetaDataEditor;
