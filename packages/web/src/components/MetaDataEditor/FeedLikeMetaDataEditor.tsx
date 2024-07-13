import { type IStateFeed, feedAtom } from "@/stateV2/moments";
import { Form } from "antd";
import { useSetAtom } from "jotai";
import DragSort from "./DragSort";
import FriendSelect, { FriendItem } from "./FriendSelect";

const FeedLikeMetaDataEditor = ({
	data,
	index,
}: EditorProps<IStateFeed["likeUserIds"], IStateFeed["id"]>) => {
	const [form] = Form.useForm<IStateFeed>();
	const setFeed = useSetAtom(feedAtom(index));

	const onFinish = (values: IStateFeed) => {
		setFeed((prev) => ({
			...prev,
			likeUserIds: values.likeUserIds,
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
			initialValues={{ likeUserIds: data }}
		>
			<Form.Item<IStateFeed> name="likeUserIds" label="点赞用户">
				<FriendSelect mode="multiple" withMyself showSearch={false} withQuickAdd />
			</Form.Item>
			<Form.Item<IStateFeed> name="likeUserIds" label="点赞用户顺序">
				<DragSort LabelComponent={FriendItem} />
			</Form.Item>
		</Form>
	);
};

export default FeedLikeMetaDataEditor;
