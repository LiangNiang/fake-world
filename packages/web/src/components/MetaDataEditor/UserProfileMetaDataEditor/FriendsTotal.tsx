import {
	type TStateFriendsTotalCountDisplayConfig,
	setFriendsTotalCountDisplayConfigValue,
} from "@/stateV2/profile";
import { Form, InputNumber, Radio } from "antd";

const FriendsTotlaMetaDataEditor = ({
	data,
}: EditorProps<TStateFriendsTotalCountDisplayConfig>) => {
	const [form] = Form.useForm<TStateFriendsTotalCountDisplayConfig>();

	const calcuateTypeValue = Form.useWatch("calcuateType", form);

	const onFinish = (values: TStateFriendsTotalCountDisplayConfig) => {
		setFriendsTotalCountDisplayConfigValue(values);
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
			<Form.Item<TStateFriendsTotalCountDisplayConfig> name="calcuateType" label="好友总数计算方式">
				<Radio.Group>
					<Radio value="auto">自动</Radio>
					<Radio value="static">静态值</Radio>
				</Radio.Group>
			</Form.Item>
			<Form.Item<TStateFriendsTotalCountDisplayConfig> name="count" label="好友总数">
				<InputNumber disabled={calcuateTypeValue === "auto"} min={1} />
			</Form.Item>
		</Form>
	);
};

export default FriendsTotlaMetaDataEditor;
