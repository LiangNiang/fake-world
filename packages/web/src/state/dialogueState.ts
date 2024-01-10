import { atom, DefaultValue, selectorFamily } from 'recoil';

import { persistAtom } from './effects';

export interface IDialogueItem {
  id: string;
  friendId: string;
  lastMessage: string;
  lastMessageTime: string;
  isPinned?: boolean;
  isMuted?: boolean;
  badgeHide?: boolean;
  unreadMarkNumber?: number;
  unreadDisplayType?: 'number' | 'dot';
}

const MOCK_DIALOGUE_LIST: IDialogueItem[] = [
  {
    id: '1',
    friendId: '1',
    lastMessage: '你好，我是塞尔达',
    lastMessageTime: '12:55',
    isPinned: true,
    unreadMarkNumber: 12,
  },
  {
    id: '3',
    friendId: '4',
    lastMessage: '我是 luigi',
    lastMessageTime: '09:23',
    unreadMarkNumber: 1,
  },
  {
    id: '2',
    friendId: '2',
    lastMessage: '我是星之笨比bot',
    lastMessageTime: '星期四',
    isMuted: true,
  },
];

export const dialogueListState = atom<typeof MOCK_DIALOGUE_LIST>({
  key: 'dialogueListState',
  default: MOCK_DIALOGUE_LIST,
  effects_UNSTABLE: [persistAtom],
});

export const dialogueItemState = selectorFamily<IDialogueItem, IDialogueItem['id']>({
  key: 'dialogueItemState',
  get:
    (param) =>
    ({ get }) =>
      get(dialogueListState).find((item) => item.id === param)!,
  set:
    (param) =>
    ({ set }, newValue) => {
      set(dialogueListState, (prev) => {
        if (newValue instanceof DefaultValue) {
          const defaultValue = MOCK_DIALOGUE_LIST.find((v) => v.id === param)!;
          return prev.map((item) => (item.id === param ? defaultValue : item));
        } else {
          return prev.map((item) => (item.id === param ? newValue : item));
        }
      });
    },
});
