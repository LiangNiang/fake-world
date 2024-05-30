import { Button, Form, Input, InputNumber, Radio, Switch } from "antd";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useSetRecoilState } from "recoil";

import { type IDialogueItem, dialogueItemState } from "@/state/dialogueState";

import FriendSelect from "./FriendSelect";
import { specialValueFormatter } from "./utils";

const DialogueItemMetaDataEditor = ({ data }: EditorProps<IDialogueItem, IDialogueItem["id"]>) => {
	type FormValuesType = IDialogueItem;
	const [form] = Form.useForm<FormValuesType>();
	const setDialogue = useSetRecoilState(dialogueItemState(data.id));

	const initialValues = useMemo(() => {
		const { isPinned, isMuted, unreadDisplayType, unreadMarkNumber } = data;
		return {
			...data,
			badgeHide: specialValueFormatter(data.badgeHide, false),
			isPinned: specialValueFormatter(isPinned, false),
			isMuted: specialValueFormatter(isMuted, false),
			unreadMarkNumber: specialValueFormatter(unreadMarkNumber, undefined),
			unreadDisplayType: specialValueFormatter(unreadDisplayType, "number"),
		};
	}, []);

	const onFinish = (values: FormValuesType) => {
		setDialogue((prev) => ({
			...prev,
			...values,
		}));
	};

	return (
		<Form
			form={form}
			layout="vertical"
			onFinish={onFinish}
			autoComplete="off"
			onValuesChange={() => {
				setTimeout(() => {
					form.submit();
				}, 100);
			}}
			initialValues={initialValues}
		>
			<Form.Item<IDialogueItem> name="friendId" label="关联好友" rules={[{ required: true }]}>
				<FriendSelect filterExisting withQuickAdd />
			</Form.Item>
			<Form.Item<FormValuesType>
				name="lastMessage"
				label="最后一条消息"
				rules={[{ required: true }]}
			>
				<Input />
			</Form.Item>
			<Form.Item<FormValuesType>
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
									form.submit();
								}}
							>
								当前时间
							</Button>
						</>
					}
				/>
			</Form.Item>
			<Form.Item<FormValuesType> name="isMuted" label="是否静音" valuePropName="checked">
				<Switch />
			</Form.Item>
			<Form.Item<FormValuesType> name="isPinned" label="是否置顶" valuePropName="checked">
				<Switch />
			</Form.Item>
			<Form.Item<FormValuesType> name="unreadMarkNumber" label="未读通知数量">
				<InputNumber min={1} />
			</Form.Item>
			<Form.Item<FormValuesType> name="badgeHide" label="是否隐藏未读角标" valuePropName="checked">
				<Switch />
			</Form.Item>
			<Form.Item<FormValuesType> name="unreadDisplayType" label="未读角标显示方式">
				<Radio.Group>
					<Radio value="number">数字</Radio>
					<Radio value="dot">红点</Radio>
				</Radio.Group>
			</Form.Item>
		</Form>
	);
};

export default DialogueItemMetaDataEditor;
