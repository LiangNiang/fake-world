import { Form } from "antd";
import { useSetRecoilState } from "recoil";

import { type IFeed, feedState } from "@/state/moments";

import DragSort from "./DragSort";
import FriendSelect, { FriendItem } from "./FriendSelect";

const FeedLikeMetaDataEditor = ({
	data,
	index,
}: EditorProps<IFeed["likeUserIds"], IFeed["id"]>) => {
	const [form] = Form.useForm<IFeed>();
	const setFeed = useSetRecoilState(feedState(index));

	const onFinish = (values: IFeed) => {
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
			<Form.Item<IFeed> name="likeUserIds" label="点赞用户">
				<FriendSelect mode="multiple" withMyself showSearch={false} withQuickAdd />
			</Form.Item>
			<Form.Item<IFeed> name="likeUserIds" label="点赞用户顺序">
				<DragSort LabelComponent={FriendItem} />
			</Form.Item>
		</Form>
	);
};

export default FeedLikeMetaDataEditor;
