import type { Descendant } from "slate";

export enum EConversationType {
	text = "text",
	image = "image",
	video = "video",
	voice = "voice",
	centerText = "centerText",
	transfer = "transfer",
	redPacket = "redPacket",
	redPacketAcceptedReply = "redPacketAcceptedReply",
	personalCard = "personalCard",
}

export type TConversationRole = "mine" | "friend";

export interface IConversationItemBase {
	id: string;
	upperText?: string;
	sendTimestamp?: number;
	role: TConversationRole;
}

export interface IConversationTypeText extends IConversationItemBase {
	type: EConversationType.text;
	textContent: Descendant[];
	referenceId?: IConversationItemBase["id"];
}

export interface IConversationTypeSingleUpperText extends IConversationItemBase {
	type: EConversationType.centerText;
	simpleContent: string;
	extraClassName?: string;
}

export interface IConversationTypeTransfer extends IConversationItemBase {
	type: EConversationType.transfer;
	originalSender: TConversationRole;
	transferStatus: "awaiting" | "accepted" | "rejected" | "expired";
	amount: string;
	note?: string;
}

export interface IConversationTypeRedPacket extends IConversationItemBase {
	type: EConversationType.redPacket;
	originalSender: TConversationRole;
	redPacketStatus: "awaiting" | "accepted" | "expired";
	amount: string;
	note?: string;
}

export interface IConversationTypeRedPacketAcceptedReply extends IConversationItemBase {
	type: EConversationType.redPacketAcceptedReply;
	redPacketId: string;
}

export interface IConversationTypeImage extends IConversationItemBase {
	type: EConversationType.image;
	imageInfo: string;
}

export interface ICoversationTypeVideo extends IConversationItemBase {
	type: EConversationType.video;
	videoInfo: string;
}

export interface IConversationTypeVoice extends IConversationItemBase {
	type: EConversationType.voice;
	duration: number;
	isRead?: boolean;
	/** 是否显示语音转文字内容 */
	showStt?: boolean;
	/** 语音转文字内容 */
	stt?: string;
}

export interface IConversationTypePersonalCard extends IConversationItemBase {
	type: EConversationType.personalCard;
	avatarInfo: string;
	nickname: string;
}

export type TConversationItem =
	| IConversationTypeText
	| IConversationTypeSingleUpperText
	| IConversationTypeTransfer
	| IConversationTypeImage
	| ICoversationTypeVideo
	| IConversationTypeVoice
	| IConversationTypeRedPacket
	| IConversationTypeRedPacketAcceptedReply
	| IConversationTypePersonalCard;
