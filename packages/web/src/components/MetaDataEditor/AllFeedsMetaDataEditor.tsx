import { DEFAULT_FEED } from "@/faker/wechat/moments";
import { type IStateFeed, feedListAtom } from "@/stateV2/moments";
import type { IStateProfile } from "@/stateV2/profile";
import { Button, DatePicker, Form, Radio, type RadioChangeEvent } from "antd";
import dayjs from "dayjs";
import { useSetAtom } from "jotai";
import { omit } from "lodash-es";
import { nanoid } from "nanoid";
import DragSort from "./DragSort";
import FriendSelect, { FriendItem } from "./FriendSelect";
import LocalImageUploadWithPreview from "./LocalImageUpload";
import SlateInput from "./SlateInput";

const AllFeedsMetaDataEditor = ({ index }: EditorProps<unknown, IStateProfile["id"]>) => {
	const [form] = Form.useForm<IStateFeed>();
	const setFeedList = useSetAtom(feedListAtom);

	const withInitialUserId = index !== undefined;

	const onFinish = (values: IStateFeed) => {
		const id = nanoid(5);
		setFeedList((prev) => [...prev, { ...values, id }]);
		form.resetFields();
	};

	const onTypeChange = (ev: RadioChangeEvent) => {
		const value = ev.target.value;
		switch (value) {
			case "textWithImages":
				form.setFieldValue(["content", "imagesInfo"], []);
				break;
			case "video":
				form.setFieldValue(["content", "videoInfo"], undefined);
				break;
			default:
				return;
		}
	};

	return (
		<Form
			form={form}
			layout="vertical"
			autoComplete="off"
			onFinish={onFinish}
			initialValues={{
				...omit(DEFAULT_FEED, "userId", "sendTimestamp"),
				userId: index ?? undefined,
				sendTimestamp: dayjs().valueOf(),
			}}
		>
			<Form.Item<IStateFeed> name="userId" label="发送者" rules={[{ required: true }]}>
				<FriendSelect withQuickAdd withMyself disabled={withInitialUserId} />
			</Form.Item>
			<Form.Item<IStateFeed>
				name="sendTimestamp"
				label="发送时间"
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
			<Form.Item<IStateFeed> name={["content", "type"]} label="类型" rules={[{ required: true }]}>
				<Radio.Group onChange={onTypeChange}>
					<Radio value="text">纯文本</Radio>
					<Radio value="textWithImages">图文</Radio>
					<Radio value="video">视频</Radio>
				</Radio.Group>
			</Form.Item>
			<Form.Item<IStateFeed> name={["content", "text"]} label="文本内容">
				<SlateInput />
			</Form.Item>
			<Form.Item<IStateFeed> noStyle shouldUpdate={(pv, cv) => pv.content.type !== cv.content.type}>
				{({ getFieldValue }) => {
					const type = getFieldValue(["content", "type"]);
					switch (type) {
						case "textWithImages":
							return (
								<Form.Item<IStateFeed>
									name={["content", "imagesInfo"]}
									label="图片"
									tooltip="最多九张图片"
								>
									<LocalImageUploadWithPreview maxImagesCount={9} />
								</Form.Item>
							);
						case "video":
							return (
								<Form.Item<IStateFeed>
									name={["content", "videoInfo"]}
									label="视频"
									tooltip="视频和图片一样，仅仅只是展示的时候加一个播放图标"
								>
									<LocalImageUploadWithPreview />
								</Form.Item>
							);
						default:
							return null;
					}
				}}
			</Form.Item>
			<Form.Item<IStateFeed> name="likeUserIds" label="点赞用户">
				<FriendSelect mode="multiple" withMyself showSearch={false} withQuickAdd allowClear />
			</Form.Item>
			<Form.Item<IStateFeed>
				noStyle
				shouldUpdate={(pv, cv) => pv.likeUserIds?.length !== cv.likeUserIds?.length}
			>
				{({ getFieldValue }) =>
					getFieldValue("likeUserIds")?.length ? (
						<Form.Item<IStateFeed> name="likeUserIds" label="点赞用户顺序">
							<DragSort LabelComponent={FriendItem} />
						</Form.Item>
					) : null
				}
			</Form.Item>
			<Form.Item>
				<Button type="primary" htmlType="submit">
					创建
				</Button>
			</Form.Item>
		</Form>
	);
};

export default AllFeedsMetaDataEditor;
