import { memo } from "react";

import type { IConversationTypeText } from "@/state/conversationState";
import type { IProfile } from "@/state/profile";
import SlateText from "@/wechatComponents/SlateText";

import CommonBlock from "./CommonBlock";
import TextReference from "./TextReference";

type Props = {
	conversationItemId: IConversationTypeText["id"];
	upperText: IConversationTypeText["upperText"];
	senderId: IProfile["id"];
	textContent: IConversationTypeText["textContent"];
	referenceId: IConversationTypeText["referenceId"];
};

const Text = ({ upperText, senderId, textContent, referenceId, conversationItemId }: Props) => {
	return (
		<>
			<CommonBlock
				upperText={upperText}
				senderId={senderId}
				innerBlockClassName="group-[.friend]:bg-white group-[.mine]:bg-[#8CE97F] group-[.friend]:before:bg-white group-[.mine]:before:bg-[#8CE97F]"
			>
				<SlateText content={textContent} />
			</CommonBlock>
			{referenceId && (
				<TextReference referenceId={referenceId} conversationItemId={conversationItemId} />
			)}
		</>
	);
};

export default memo(Text);
