import { type IStateProfile, MOMENTS_PRIVACY_TEXT_MAP, myProfileAtom } from "@/stateV2/profile";
import { Form, Input, InputNumber, Radio, Select } from "antd";
import { useSetAtom } from "jotai";
import { keys } from "lodash-es";
import LocalImageUploadWithPreview from "../LocalImageUpload";

const MyProfileMetaDataEditor = ({ data }: EditorProps<IStateProfile>) => {
	const setMyProfile = useSetAtom(myProfileAtom);

	const [form] = Form.useForm();

	const onFinish = (values: IStateProfile) => {
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
			<Form.Item<IStateProfile> name="avatarInfo" label="头像">
				<LocalImageUploadWithPreview />
			</Form.Item>
			<Form.Item<IStateProfile> name="nickname" label="昵称" required rules={[{ required: true }]}>
				<Input />
			</Form.Item>
			<Form.Item<IStateProfile> name="wechat" label="微信号" required rules={[{ required: true }]}>
				<Input />
			</Form.Item>
			<Form.Item<IStateProfile> name="momentsBackgroundInfo" label="朋友圈背景图">
				<LocalImageUploadWithPreview />
			</Form.Item>
			<Form.Item<IStateProfile> name="momentsPrivacy" label="允许朋友查看朋友圈的范围">
				<Select
					options={keys(MOMENTS_PRIVACY_TEXT_MAP).map((k) => ({
						label: MOMENTS_PRIVACY_TEXT_MAP[k as keyof typeof MOMENTS_PRIVACY_TEXT_MAP],
						value: k,
					}))}
				/>
			</Form.Item>
			<Form.Item<IStateProfile> name="signature" label="个性签名">
				<Input />
			</Form.Item>
			<Form.Item<IStateProfile> name="gender" label="性别">
				<Radio.Group>
					<Radio value="male">男</Radio>
					<Radio value="female">女</Radio>
				</Radio.Group>
			</Form.Item>
			<Form.Item<IStateProfile> name="area" label="地区">
				<Input />
			</Form.Item>
			<Form.Item<IStateProfile> name="tickleText" label="拍一拍文本">
				<Input addonBefore="朋友拍了拍我" />
			</Form.Item>
			<Form.Item<IStateProfile> name="coin" label="微信豆个数">
				<InputNumber min={0} />
			</Form.Item>
		</Form>
	);
};

export default MyProfileMetaDataEditor;
