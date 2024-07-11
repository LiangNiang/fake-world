import dayjs from "dayjs";
import { atom, atomFamily, selectorFamily } from "recoil";
import type { Descendant } from "slate";

import { SLATE_INITIAL_VALUE } from "@/wechatComponents/SlateText/utils";

import { persistAtom } from "./effects";
import type { IProfile } from "./profile";

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

export const ConversationTypeLabel = {
	[EConversationType.text]: "文本",
	[EConversationType.image]: "图片",
	[EConversationType.transfer]: "转账",
	[EConversationType.redPacket]: "红包",
	[EConversationType.personalCard]: "个人名片",
	[EConversationType.voice]: "语音消息",
	[EConversationType.video]: "视频",
	[EConversationType.centerText]: "居中文本",
	[EConversationType.redPacketAcceptedReply]: "红包领取成功消息",
};

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

export interface IConversationInputConfig {
	sendRole: TConversationRole;
}

const MOCK_INIT_CONVERSATION_LIST: TConversationItem[] = [
	{
		id: "1",
		type: EConversationType.text,
		textContent: [
			{
				type: "paragraph",
				children: [
					{ text: "你好" },
					{ type: "emoji", emojiSymbol: "0-0", children: [{ text: "" }] },
					{ text: "" },
				],
			},
		],
		role: 'friend',
		upperText: "12:57",
	},
	{
		id: "2",
		type: EConversationType.text,
		textContent: [
			{
				type: "paragraph",
				children: [{ text: "halo halo" }],
			},
		],
		role: 'mine',
		upperText: "16:08",
	},
	{
		id: "3",
		type: EConversationType.transfer,
		role: 'mine',
		transferStatus: "awaiting",
		amount: "200.00",
		upperText: "17:01",
		originalSender: 'mine',
	},
	{
		id: "4",
		type: EConversationType.image,
		role: 'mine',
		imageInfo: "https://cdn-fakeworld.azureedge.net/fakeworld/ow7vh8.jpg",
	},
	{
		id: "5",
		type: EConversationType.voice,
		role: 'friend',
		upperText: "17:20",
		duration: 5,
		showStt: false,
		stt: "我要给你发一个大红包！！",
	},
	{
		id: "6",
		type: EConversationType.redPacket,
		role: 'friend',
		originalSender: 'friend',
		amount: "0.01",
		redPacketStatus: "awaiting",
	},
	{
		id: "9",
		type: EConversationType.text,
		textContent: [
			{
				type: "paragraph",
				children: [{ text: "你也好" }],
			},
		],
		role: 'mine',
		referenceId: "1",
	},
	{
		id: "7",
		type: EConversationType.personalCard,
		role: 'mine',
		avatarInfo: "https://cdn-fakeworld.azureedge.net/fakeworld/kbw.jpg",
		nickname: "酷霸王",
	},
];

export const conversationState = atomFamily<TConversationItem[], IProfile["id"]>({
	key: "conversationState",
	default: () => MOCK_INIT_CONVERSATION_LIST,
	effects_UNSTABLE: () => [persistAtom],
});

export const conversationItemReferenceState = selectorFamily<
	TConversationItem | undefined,
	{
		profileId: IProfile["id"];
		conversationId: IConversationItemBase["id"];
	}
>({
	key: "conversationItemReferenceState",
	get:
		(param) =>
		({ get }) => {
			const conversationList = get(conversationState(param.profileId));
			return conversationList.find((v) => v.id === param.conversationId);
		},
});

export const conversationInputState = atom<IConversationInputConfig>({
	key: "conversationInputState",
	default: {
		sendRole: 'mine',
	},
});

export const conversationInputValueState = atom<Descendant[]>({
	key: "conversationInputValueState",
	default: SLATE_INITIAL_VALUE,
});

export const recentUseEmojiState = atom<string[]>({
	key: "recentUseEmojiState",
	default: [],
	effects_UNSTABLE: [persistAtom],
});

export const fromLastGenerateUpperText = (list: TConversationItem[]) => {
	const last = list[list.length - 1];
	let upperText: undefined | string;
	if (!last || !last.sendTimestamp) upperText = dayjs().format("HH:mm");
	if (last?.sendTimestamp && dayjs().diff(last.sendTimestamp, "minute") >= 4) {
		upperText = dayjs().format("HH:mm");
	}
	return upperText;
};
