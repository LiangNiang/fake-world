import { EConversationType, type TConversationItem } from "./typing";

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

export const MOCK_INIT_CONVERSATION_LIST: TConversationItem[] = [
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
		role: "friend",
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
		role: "mine",
		upperText: "16:08",
	},
	{
		id: "3",
		type: EConversationType.transfer,
		role: "mine",
		transferStatus: "awaiting",
		amount: "200.00",
		upperText: "17:01",
		originalSender: "mine",
	},
	{
		id: "4",
		type: EConversationType.image,
		role: "mine",
		imageInfo: "https://cdn-fakeworld.azureedge.net/fakeworld/ow7vh8.jpg",
	},
	{
		id: "5",
		type: EConversationType.voice,
		role: "friend",
		upperText: "17:20",
		duration: 5,
		showStt: false,
		stt: "我要给你发一个大红包！！",
	},
	{
		id: "6",
		type: EConversationType.redPacket,
		role: "friend",
		originalSender: "friend",
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
		role: "mine",
		referenceId: "1",
	},
	{
		id: "7",
		type: EConversationType.personalCard,
		role: "mine",
		avatarInfo: "https://cdn-fakeworld.azureedge.net/fakeworld/kbw.jpg",
		nickname: "酷霸王",
	},
];
