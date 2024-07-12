import RedPacketCloseIMG from "@/assets/red-packet-close.png";
import {
	type IConversationTypeRedPacket,
	type IConversationTypeRedPacketAcceptedReply,
	conversationListAtom,
} from "@/stateV2/conversation";
import UserName from "@/wechatComponents/User/UserName";
import { useAtom } from "jotai";
import { memo } from "react";
import { useConversationAPI } from "../../context";

type Props = {
	redPacketId: IConversationTypeRedPacketAcceptedReply["redPacketId"];
	upperText: IConversationTypeRedPacketAcceptedReply["upperText"];
	id: IConversationTypeRedPacketAcceptedReply["id"];
};

const RedPacketAcceptedReply = ({ redPacketId, upperText, id }: Props) => {
	const { conversationId } = useConversationAPI();
	const [conversationList, setConversationList] = useAtom(conversationListAtom(conversationId));
	const redPacket = conversationList.find((v) => v.id === redPacketId);

	if (!redPacket) {
		console.log(213);
		setConversationList((prev) => prev.filter((v) => v.id !== id));
		return null;
	}

	const { originalSender } = redPacket as IConversationTypeRedPacket;
	const left =
		originalSender === "friend" ? "你" : <UserName id={conversationId} className="text-black/50" />;
	const right =
		originalSender === "friend" ? <UserName id={conversationId} className="text-black/50" /> : "你";

	return (
		<>
			{upperText && <div className={"m-auto text-black/50 text-xs"}>{upperText}</div>}
			<div className="m-auto flex items-center text-black/50 text-xs">
				<img src={RedPacketCloseIMG} className="w-4" />
				<div className="ml-2">
					{left}
					<span>领取了</span>
					{right}的<span className="text-wechatOrange-3">红包</span>
				</div>
			</div>
		</>
	);
};

export default memo(RedPacketAcceptedReply);
