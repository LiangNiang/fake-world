import dayjs from 'dayjs';
import { atom, atomFamily } from 'recoil';
import { Descendant } from 'slate';

import { SLATE_INITIAL_VALUE } from '@/wechatComponents/SlateText/utils';

import { persistAtom } from './effects';
import { IProfile } from './profile';

export enum EConversationType {
  text = 'text',
  image = 'image',
  video = 'video',
  voice = 'voice',
  centerText = 'centerText',
  transfer = 'transfer',
  redPacket = 'redPacket',
  redPacketAcceptedReply = 'redPacketAcceptedReply',
}

export const ConversationTypeLabel = {
  [EConversationType.text]: '文本',
  [EConversationType.image]: '图片',
  [EConversationType.transfer]: '转账',
  [EConversationType.redPacket]: '红包',
  [EConversationType.voice]: '语音消息',
  [EConversationType.video]: '视频',
  [EConversationType.centerText]: '居中文本',
  [EConversationType.redPacketAcceptedReply]: '红包领取成功消息',
};

export enum EConversationRole {
  mine = 'mine',
  friend = 'friend',
}

export interface IConversationItemBase {
  id: string;
  upperText?: string;
  sendTimestamp?: number;
  role: EConversationRole;
}

export interface IConversationTypeText extends IConversationItemBase {
  type: EConversationType.text;
  textContent: Descendant[];
}

export interface IConversationTypeSingleUpperText extends IConversationItemBase {
  type: EConversationType.centerText;
  simpleContent: string;
  extraClassName?: string;
}

export interface IConversationTypeTransfer extends IConversationItemBase {
  type: EConversationType.transfer;
  originalSender: EConversationRole;
  transferStatus: 'awaiting' | 'accepted' | 'rejected' | 'expired';
  amount: string;
  note?: string;
}

export interface IConversationTypeRedPacket extends IConversationItemBase {
  type: EConversationType.redPacket;
  originalSender: EConversationRole;
  redPacketStatus: 'awaiting' | 'accepted' | 'expired';
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
}

export type TConversationItem =
  | IConversationTypeText
  | IConversationTypeSingleUpperText
  | IConversationTypeTransfer
  | IConversationTypeImage
  | ICoversationTypeVideo
  | IConversationTypeVoice
  | IConversationTypeRedPacket
  | IConversationTypeRedPacketAcceptedReply;

export interface IConversationInputConfig {
  sendRole: EConversationRole;
}

const MOCK_INIT_CONVERSATION_LIST: TConversationItem[] = [
  {
    id: '1',
    type: EConversationType.text,
    textContent: [
      {
        type: 'paragraph',
        children: [{ text: '你好' }, { type: 'emoji', emojiSymbol: '0-0', children: [{ text: '' }] }, { text: '' }],
      },
    ],
    role: EConversationRole.friend,
    upperText: '12:57',
  },
  {
    id: '2',
    type: EConversationType.text,
    textContent: [
      {
        type: 'paragraph',
        children: [{ text: 'halo halo' }],
      },
    ],
    role: EConversationRole.mine,
    upperText: '16:08',
  },
  {
    id: '3',
    type: EConversationType.transfer,
    role: EConversationRole.mine,
    transferStatus: 'awaiting',
    amount: '200.00',
    upperText: '17:01',
    originalSender: EConversationRole.mine,
  },
  {
    id: '4',
    type: EConversationType.image,
    role: EConversationRole.mine,
    imageInfo: 'https://cdn-fakeworld.azureedge.net/fakeworld/ow7vh8.jpg',
  },
  {
    id: '5',
    type: EConversationType.voice,
    role: EConversationRole.friend,
    upperText: '17:20',
    duration: 5,
  },
  {
    id: '6',
    type: EConversationType.redPacket,
    role: EConversationRole.friend,
    originalSender: EConversationRole.friend,
    amount: '0.01',
    redPacketStatus: 'awaiting',
  },
];

export const conversationState = atomFamily<TConversationItem[], IProfile['id']>({
  key: 'conversationState',
  default: () => MOCK_INIT_CONVERSATION_LIST,
  effects_UNSTABLE: () => [persistAtom],
});

export const conversationInputState = atom<IConversationInputConfig>({
  key: 'conversationInputState',
  default: {
    sendRole: EConversationRole.mine,
  },
});

export const conversationInputValueState = atom<Descendant[]>({
  key: 'conversationInputValueState',
  default: SLATE_INITIAL_VALUE,
});

export const recentUseEmojiState = atom<string[]>({
  key: 'recentUseEmojiState',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const fromLastGenerateUpperText = (list: TConversationItem[]) => {
  const last = list[list.length - 1];
  let upperText: undefined | string;
  if (!last || !last.sendTimestamp) upperText = dayjs().format('HH:mm');
  if (last && last.sendTimestamp && dayjs().diff(last.sendTimestamp, 'minute') >= 4) {
    upperText = dayjs().format('HH:mm');
  }
  return upperText;
};
