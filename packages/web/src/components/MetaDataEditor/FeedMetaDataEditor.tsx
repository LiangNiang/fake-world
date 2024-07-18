import { type IStateFeed, feedAtom } from "@/stateV2/moments";
import { DatePicker, Form, Radio } from "antd";
import dayjs from "dayjs";
import { useSetAtom } from "jotai";
import DragSort from "./DragSort";
import FriendSelect, { FriendItem } from "./FriendSelect";
import LocalImageUploadWithPreview from "./LocalImageUpload";
import WrapSlateInput from "./SlateInput";

const FeedMetaDataEditor = ({ data, index }: EditorProps<IStateFeed, IStateFeed["id"]>) => {
	const [form] = Form.useForm<IStateFeed>();
	const setFeed = useSetAtom(feedAtom(index));

	const onFinish = (values: IStateFeed) => {
		setFeed((prev) => ({
			...prev,
			...values,
			content: {
				...prev.content,
				...values.content,
			},
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
			<Form.Item<IStateFeed> name="userId" label="发送者" rules={[{ required: true }]}>
				<FriendSelect withQuickAdd withMyself />
			</Form.Item>
			<Form.Item<IStateFeed>
				name="sendTimestamp"
				label="发送时间"
				required
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
			<Form.Item<IStateFeed>
				name={["content", "type"]}
				label="类型"
				tooltip="不支持直接修改类型，请删除后重新创建"
			>
				<Radio.Group disabled>
					<Radio value="text">纯文本</Radio>
					<Radio value="textWithImages">图文</Radio>
					<Radio value="video">视频</Radio>
				</Radio.Group>
			</Form.Item>
			<Form.Item<IStateFeed> name={["content", "text"]} label="文本内容">
				<WrapSlateInput />
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
		</Form>
	);
};

export default FeedMetaDataEditor;
