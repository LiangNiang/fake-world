import { Form, InputNumber, Radio } from "antd";
import { getRecoil, setRecoil } from "recoil-nexus";

import { type IFriendsTotalCountDisplay, friendsTotalCountState } from "@/state/profile";

const FriendsTotlaMetaDataEditor = ({ data }: EditorProps<IFriendsTotalCountDisplay>) => {
	const [form] = Form.useForm<IFriendsTotalCountDisplay>();

	const calcuateTypeValue = Form.useWatch("calcuateType", form);

	const onFinish = (values: IFriendsTotalCountDisplay) => {
		setRecoil(friendsTotalCountState, values);
		if (values.calcuateType === "auto") {
			form.setFieldsValue({
				count: getRecoil(friendsTotalCountState).count,
			});
		}
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
			<Form.Item<IFriendsTotalCountDisplay> name="calcuateType" label="好友总数计算方式">
				<Radio.Group>
					<Radio value="auto">自动</Radio>
					<Radio value="static">静态值</Radio>
				</Radio.Group>
			</Form.Item>
			<Form.Item<IFriendsTotalCountDisplay> name="count" label="好友总数">
				<InputNumber disabled={calcuateTypeValue === "auto"} min={1} />
			</Form.Item>
		</Form>
	);
};

export default FriendsTotlaMetaDataEditor;
