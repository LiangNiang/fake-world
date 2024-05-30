import { Button, Form, Input, InputNumber, Radio, Switch } from "antd";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { useSetRecoilState } from "recoil";

import { type IDialogueItem, dialogueListState } from "@/state/dialogueState";

import FriendSelect from "./FriendSelect";

const DialogueListMetaDataEditor = () => {
	const [form] = Form.useForm<IDialogueItem>();
	const setDialogueListState = useSetRecoilState(dialogueListState);

	const onFinish = (values: IDialogueItem) => {
		setDialogueListState((prev) => [
			{
				...values,
				id: nanoid(5),
			},
			...prev,
		]);
		form.resetFields();
	};

	return (
		<Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
			<Form.Item<IDialogueItem> name="friendId" label="关联好友" rules={[{ required: true }]}>
				<FriendSelect filterExisting withQuickAdd />
			</Form.Item>
			<Form.Item<IDialogueItem>
				name="lastMessage"
				label="最后一条消息"
				rules={[{ required: true }]}
			>
				<Input />
			</Form.Item>
			<Form.Item<IDialogueItem>
				name="lastMessageTime"
				label="最后一条消息发送时间"
				rules={[{ required: true }]}
			>
				<Input
					suffix={
						<>
							<Button
								onClick={() => {
									const time = dayjs().format("HH:mm");
									form.setFieldValue("lastMessageTime", time);
								}}
							>
								当前时间
							</Button>
						</>
					}
				/>
			</Form.Item>
			<Form.Item<IDialogueItem> name="isMuted" label="是否静音" valuePropName="checked">
				<Switch />
			</Form.Item>
			<Form.Item<IDialogueItem> name="isPinned" label="是否置顶" valuePropName="checked">
				<Switch />
			</Form.Item>
			<Form.Item<IDialogueItem> name="unreadMarkNumber" label="未读通知数量">
				<InputNumber min={1} />
			</Form.Item>
			<Form.Item<IDialogueItem> name="badgeHide" label="是否隐藏未读角标" valuePropName="checked">
				<Switch />
			</Form.Item>
			<Form.Item<IDialogueItem> name="unreadDisplayType" label="未读角标显示方式">
				<Radio.Group>
					<Radio value="number">数字</Radio>
					<Radio value="dot">红点</Radio>
				</Radio.Group>
			</Form.Item>
			<Form.Item>
				<Button type="primary" htmlType="submit">
					创建
				</Button>
			</Form.Item>
		</Form>
	);
};

export default DialogueListMetaDataEditor;
