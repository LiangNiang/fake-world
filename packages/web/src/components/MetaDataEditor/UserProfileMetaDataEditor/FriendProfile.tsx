import { MinusCircleOutlined, PhoneOutlined, TagOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Radio, Select, Switch } from "antd";
import { isEmpty, keys } from "lodash-es";
import { useSetRecoilState } from "recoil";

import { MYSELF_ID } from "@/faker/wechat/user";
import { type IProfile, MOMENTS_PRIVACY_TEXT_MAP, friendState } from "@/state/profile";

import LocalImageUploadWithPreview from "../LocalImageUpload";

const FriendProfileMetaDataEditor = ({ data, index }: EditorProps<IProfile, IProfile["id"]>) => {
	const setFriendProfile = useSetRecoilState(friendState(index));
	const { id } = data;

	const [form] = Form.useForm();

	const onFinish = (values: IProfile) => {
		setFriendProfile((prev) => ({
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
			<Form.Item<IProfile> name="avatarInfo" label="头像">
				<LocalImageUploadWithPreview />
			</Form.Item>
			<Form.Item<IProfile> name="nickname" label="昵称" required rules={[{ required: true }]}>
				<Input />
			</Form.Item>
			{id !== MYSELF_ID && (
				<Form.Item<IProfile>
					name="remark"
					label="备注"
					normalize={(v) => (isEmpty(v) ? undefined : v)}
				>
					<Input />
				</Form.Item>
			)}
			<Form.Item<IProfile> name="wechat" label="微信号" required rules={[{ required: true }]}>
				<Input />
			</Form.Item>
			<Form.Item<IProfile> name="momentsBackgroundInfo" label="朋友圈背景图">
				<LocalImageUploadWithPreview />
			</Form.Item>
			<Form.Item<IProfile> name="momentsPrivacy" label="允许朋友查看朋友圈的范围">
				<Select
					options={keys(MOMENTS_PRIVACY_TEXT_MAP).map((k) => ({
						label: MOMENTS_PRIVACY_TEXT_MAP[k as keyof typeof MOMENTS_PRIVACY_TEXT_MAP],
						value: k,
					}))}
				/>
			</Form.Item>
			<Form.Item<IProfile>
				name="momentsBackgroundLike"
				label="朋友圈背景图是否点赞"
				valuePropName="checked"
			>
				<Switch />
			</Form.Item>
			<Form.Item<IProfile> name="signature" label="个性签名">
				<Input />
			</Form.Item>
			<Form.Item<IProfile> name="gender" label="性别">
				<Radio.Group>
					<Radio value="male">男</Radio>
					<Radio value="female">女</Radio>
				</Radio.Group>
			</Form.Item>
			<Form.Item<IProfile> name="isStarred" label="是否是星标好友" valuePropName="checked">
				<Switch />
			</Form.Item>
			<Form.Item<IProfile> name="hideGender" label="是否隐藏性别" valuePropName="checked">
				<Switch />
			</Form.Item>
			<Form.Item<IProfile> name="area" label="地区">
				<Input />
			</Form.Item>
			<Form.List name="phone">
				{(fields, { add, remove }) => (
					<>
						{fields.map((field, index) => (
							<Form.Item label={index === 0 ? "电话号码" : ""} key={field.key}>
								<Form.Item {...field} rules={[{ required: true, message: "请输入电话" }]} noStyle>
									<Input addonBefore={<PhoneOutlined />} style={{ width: "85%" }} />
								</Form.Item>
								<Button
									icon={<MinusCircleOutlined />}
									onClick={() => remove(field.name)}
									className="ml-2"
								/>
							</Form.Item>
						))}
						<Form.Item>
							<Button onClick={() => add()}>添加电话</Button>
						</Form.Item>
					</>
				)}
			</Form.List>
			<Form.List name="tags">
				{(fields, { add, remove }) => (
					<>
						{fields.map((field, index) => (
							<Form.Item label={index === 0 ? "标签" : ""} key={field.key}>
								<Form.Item {...field} rules={[{ required: true, message: "请输入标签名" }]} noStyle>
									<Input addonBefore={<TagOutlined />} style={{ width: "85%" }} />
								</Form.Item>
								<Button
									icon={<MinusCircleOutlined />}
									onClick={() => remove(field.name)}
									className="ml-2"
								/>
							</Form.Item>
						))}
						<Form.Item>
							<Button onClick={() => add()}>添加标签</Button>
						</Form.Item>
					</>
				)}
			</Form.List>
			<Form.Item<IProfile> name="description" label="描述">
				<Input />
			</Form.Item>
			<Form.Item<IProfile> name="privacy" label="朋友权限">
				<Select
					options={[
						{ label: "聊天、朋友圈、微信运动等", value: "all" },
						{ label: "仅聊天", value: "chatsOnly" },
						{ label: "不让他/她看", value: "hideMyPosts" },
						{ label: "不看他/她", value: "hideFriendPosts" },
					]}
				/>
			</Form.Item>
			<Form.Item<IProfile> name="thumbnailInfo" label="朋友圈缩略图" tooltip="最多五张图片">
				<LocalImageUploadWithPreview maxImagesCount={5} />
			</Form.Item>
			<Form.Item<IProfile> name="hideThumbnail" label="隐藏朋友圈缩略图" valuePropName="checked">
				<Switch />
			</Form.Item>
			<Form.Item<IProfile> name="tickleText" label="拍一拍文本">
				<Input addonBefore="朋友拍了拍我" />
			</Form.Item>
			<Form.Item<IProfile> name="coin" label="微信豆个数">
				<InputNumber min={0} />
			</Form.Item>
		</Form>
	);
};

export default FriendProfileMetaDataEditor;
