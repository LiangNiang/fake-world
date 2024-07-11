import { OpenAIOutlined } from "@ant-design/icons";
import GenerateFriends from "./GenerateFriends";

const AISection = () => {
	return (
		<div className="flex flex-col">
			<div className="font-semibold text-orange-500 text-xl">
				<OpenAIOutlined /> AI 生成好友 <OpenAIOutlined />
			</div>
			<GenerateFriends />
		</div>
	);
};

export default AISection;
