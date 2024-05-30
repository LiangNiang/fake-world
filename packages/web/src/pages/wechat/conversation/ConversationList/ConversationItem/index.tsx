import { memo } from "react";
import { useParams } from "react-router-dom";

import { MYSELF_ID } from "@/faker/wechat/user";
import {
	EConversationRole,
	EConversationType,
	type TConversationItem,
} from "@/state/conversationState";

import CenterText from "./CenterText";
import Image from "./Image";
import PersonalCard from "./PersonalCard";
import RedPacket from "./RedPacket";
import RedPacketAcceptedReply from "./RedPacketAcceptedReply";
import Text from "./Text";
import Transfer from "./Transfer";
import Voice from "./Voice";

type Props = {
	data: TConversationItem;
};

const ConversationItem = ({ data }: Props) => {
	const { type, role, upperText, id: conversationItemId } = data;
	const { id } = useParams<{ id: string }>();
	const senderId = role === EConversationRole.friend ? id! : MYSELF_ID;

	switch (type) {
		case EConversationType.text:
			return (
				<Text
					conversationItemId={conversationItemId}
					upperText={upperText}
					senderId={senderId}
					textContent={data.textContent}
					referenceId={data.referenceId}
				/>
			);
		case EConversationType.centerText:
			return (
				<CenterText
					upperText={upperText}
					simpleContent={data.simpleContent}
					extraClassName={data.extraClassName}
				/>
			);
		case EConversationType.transfer:
			return (
				<Transfer
					role={role}
					upperText={upperText}
					senderId={senderId}
					amount={data.amount}
					note={data.note}
					transferStatus={data.transferStatus}
					originalSender={data.originalSender}
				/>
			);
		case EConversationType.redPacket:
			return (
				<RedPacket
					role={role}
					upperText={upperText}
					senderId={senderId}
					amount={data.amount}
					note={data.note}
					redPacketStatus={data.redPacketStatus}
					originalSender={data.originalSender}
				/>
			);
		case EConversationType.image:
			return (
				<Image role={role} imageInfo={data.imageInfo} upperText={upperText} senderId={senderId} />
			);
		case EConversationType.video:
			return (
				<Image
					role={role}
					imageInfo={data.videoInfo}
					upperText={upperText}
					senderId={senderId}
					isVideo
				/>
			);
		case EConversationType.voice:
			return (
				<Voice
					senderId={senderId}
					upperText={upperText}
					duration={data.duration}
					isRead={data.isRead}
					role={role}
					showStt={data.showStt}
					stt={data.stt}
				/>
			);
		case EConversationType.redPacketAcceptedReply:
			return (
				<RedPacketAcceptedReply id={data.id} redPacketId={data.redPacketId} upperText={upperText} />
			);
		case EConversationType.personalCard:
			return (
				<PersonalCard
					avatarInfo={data.avatarInfo}
					nickname={data.nickname}
					senderId={senderId}
					upperText={upperText}
				/>
			);
		default:
			return null;
	}
};

export default memo(ConversationItem);
