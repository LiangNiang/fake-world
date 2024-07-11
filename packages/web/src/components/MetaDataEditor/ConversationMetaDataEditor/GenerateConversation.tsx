import { generateChatMessage } from "@/services";
import {
	type EConversationRole,
	EConversationType,
	type TConversationItem,
	conversationState,
} from "@/state/conversationState";
import { type IProfile, friendState } from "@/state/profile";
import { OpenAIOutlined } from "@ant-design/icons";
import { useCreation, useUnmount } from "ahooks";
import { Button, Form, Input, type InputRef, message } from "antd";
import dayjs from "dayjs";
import { isEmpty } from "lodash-es";
import { nanoid } from "nanoid";
import { memo, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import { getRecoil } from "recoil-nexus";

type Props = {
	friendId: IProfile["id"];
	scrollToBtm: () => void;
};

const GenerateConversation = ({ friendId, scrollToBtm }: Props) => {
	const topicRef = useRef<InputRef>(null);
	const [loading, setLoading] = useState(false);
	const ctl = useCreation(() => new AbortController(), []);
	const setConversationList = useSetRecoilState(conversationState(friendId));

	useUnmount(() => {
		if (loading) {
			ctl.abort();
			message.warning("AI 生成已取消");
		}
	});

	const handleSubmit = async () => {
		setLoading(true);
		const { remark: friendRemark, nickname } = getRecoil(friendState(friendId));
		let remark = "";
		if (friendRemark) {
			remark = `我给这个好友的备注是${friendRemark}`;
		} else if (nickname) {
			remark = `这个好友的昵称是${nickname}`;
		}
		const inputValue = topicRef.current?.input?.value;
		const topic = isEmpty(inputValue)
			? "随意，但只能专注一个主题，可以贴合好友的基本信息"
			: inputValue;
		try {
			const oldPrevConversation = getRecoil(conversationState(friendId));
			generateChatMessage({
				params: {
					remark,
					topic,
				},
				signal: ctl.signal,
				adapter: "fetch",
				responseType: "stream",
			}).then(async (response) => {
				const stream = response.data;
				const reader = stream.pipeThrough(new TextDecoderStream()).getReader();
				while (true) {
					const { value, done } = await reader.read();
					if (done) {
						setLoading(false);
						message.success("生成完毕");
						break;
					}
					try {
						const lines = value.split("\n");
						for (const line of lines) {
							if (line.startsWith("data: ")) {
								const jsonString = line.slice(6);
								const data = JSON.parse(jsonString);
								const messages = data.messages as Array<{
									role: EConversationRole;
									content: string;
								}>;
								setConversationList(() => {
									return [
										...oldPrevConversation,
										...messages.map(
											(m) =>
												({
													id: nanoid(8),
													sendTimestamp: dayjs().valueOf(),
													type: EConversationType.text,
													role: m.role ?? "mine",
													textContent: [
														{
															type: "paragraph",
															children: [{ text: m.content ?? "" }],
														},
													],
												}) as TConversationItem,
										),
									];
								});
								scrollToBtm();
							}
						}
					} catch (err) {}
				}
			});
		} catch (err: any) {
			setLoading(false);
			if (err?.response?.status === 429) {
				message.error("请等待一段时间后再试");
			} else if (err?.code === "ERR_CANCELED") {
			} else {
				message.error("生成失败，请稍后再试");
			}
		}
	};

	return (
		<Form onFinish={handleSubmit}>
			<div className="flex flex-col space-y-2">
				<div className="font-semibold text-orange-500 text-xl">
					<OpenAIOutlined /> AI 生成 20 句聊天记录 <OpenAIOutlined />
				</div>
				<div className="flex items-center space-x-4">
					<Input placeholder="此处填写内容主题，为空则随机" ref={topicRef} />
					<Button htmlType="submit" loading={loading}>
						生成
					</Button>
				</div>
			</div>
		</Form>
	);
};

export default memo(GenerateConversation);
