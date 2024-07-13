import { ENV_API_BASE_URL } from "@/consts";
import {
	EConversationType,
	type TConversationItem,
	type TConversationRole,
	conversationListAtom,
	getConversationListValueSnapshot,
} from "@/stateV2/conversation";
import { type IStateProfile, getProfileValueSnapshot } from "@/stateV2/profile";
import { OpenAIOutlined } from "@ant-design/icons";
import { useUnmount } from "ahooks";
import { experimental_useObject as useObject } from "ai/react";
import { Button, Form, Input, type InputRef, message } from "antd";
import dayjs from "dayjs";
import { useSetAtom } from "jotai";
import { isEmpty } from "lodash-es";
import { nanoid } from "nanoid";
import { memo, useEffect, useRef } from "react";
import { z } from "zod";

type Props = {
	friendId: IStateProfile["id"];
	scrollToBtm: () => void;
};

const GenerateConversation = ({ friendId, scrollToBtm }: Props) => {
	const topicRef = useRef<InputRef>(null);
	const oldPrevConversationRef = useRef<TConversationItem[] | null>(null);
	const setConversationList = useSetAtom(conversationListAtom(friendId));
	const { submit, isLoading, object, stop, error } = useObject<
		{ messages: Array<{ role: TConversationRole; content: string }> },
		{ remark: string; topic: string }
	>({
		api: `${ENV_API_BASE_URL}/api/v1/ai/chat_message`,
		schema: z.object({
			messages: z.array(
				z.object({
					role: z.enum(["mine", "friend"]),
					content: z.string(),
				}),
			),
		}),
	});

	useUnmount(() => {
		if (isLoading) {
			stop();
			message.warning("AI 生成已取消");
		}
	});

	useEffect(() => {
		if (object) {
			const { messages } = object;
			if (!messages || messages.length === 0 || messages.some((m) => isEmpty(m?.role))) return;
			setConversationList(() => {
				return [
					...(oldPrevConversationRef.current ?? []),
					...messages.map(
						(m) =>
							({
								id: nanoid(8),
								sendTimestamp: dayjs().valueOf(),
								type: EConversationType.text,
								role: m?.role ?? "mine",
								textContent: [
									{
										type: "paragraph",
										children: [{ text: m?.content ?? "" }],
									},
								],
							}) as TConversationItem,
					),
				];
			});
			scrollToBtm();
		}
	}, [object]);

	useEffect(() => {
		if (error) {
			if ((error as any).message === "rate-limit reached") {
				message.error("请等待一段时间后再试");
			} else {
				message.error("AI 生成失败");
			}
		}
	}, [error]);

	const handleSubmit = async () => {
		const { remark: friendRemark, nickname } = getProfileValueSnapshot(friendId)!;
		let remark = "";
		if (friendRemark) {
			remark = `我给这个好友的备注是${friendRemark}`;
		} else if (nickname) {
			remark = `这个好友的昵称是${nickname}`;
		}
		const inputValue = topicRef.current?.input?.value;
		const topic = isEmpty(inputValue)
			? "随意，但只能专注一个主题，可以贴合好友的基本信息"
			: inputValue!;
		submit({ remark, topic });
		oldPrevConversationRef.current = getConversationListValueSnapshot(friendId);
	};

	return (
		<Form onFinish={handleSubmit}>
			<div className="flex flex-col space-y-2">
				<div className="font-semibold text-orange-500 text-xl">
					<OpenAIOutlined /> AI 生成 20 句聊天记录 <OpenAIOutlined />
				</div>
				<div className="flex items-center space-x-4">
					<Input placeholder="此处填写内容主题，为空则随机" ref={topicRef} />
					<Button htmlType="submit" loading={!error && isLoading}>
						生成
					</Button>
				</div>
			</div>
		</Form>
	);
};

export default memo(GenerateConversation);
