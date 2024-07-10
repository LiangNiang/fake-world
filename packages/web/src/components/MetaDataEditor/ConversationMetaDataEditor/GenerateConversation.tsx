import type { IProfile } from "@/state/profile";
import { OpenAIOutlined } from "@ant-design/icons";
import { useCreation } from "ahooks";
import { Button, Input, type InputRef } from "antd";
import { memo, useRef, useState } from "react";

type Props = {
	friendId: IProfile["id"];
};

const GenerateConversation = ({ friendId }: Props) => {
	const topicRef = useRef<InputRef>(null);
	const [loading, setLoading] = useState(false);
	const ctl = useCreation(() => new AbortController(), []);

	const handleSubmit = async () => {
		setLoading(true);
	};

	return (
		<div className="flex flex-col space-y-2">
			<div className="font-semibold text-orange-500 text-xl">
				<OpenAIOutlined /> AI <OpenAIOutlined />
			</div>
			<div className="flex items-center space-x-4">
				<span>生成 20 句聊天记录</span>
				<Input placeholder="此处填写内容主题，为空则随机" className="w-64" ref={topicRef} />
				<Button loading={loading} onClick={handleSubmit}>
					生成
				</Button>
			</div>
		</div>
	);
};

export default memo(GenerateConversation);
