import { useCreation } from 'ahooks';
import dayjs from 'dayjs';
import { isEqual, throttle } from 'lodash-es';
import { nanoid } from 'nanoid';
import { createContext, PropsWithChildren, RefObject, useCallback, useContext, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { getRecoil, setRecoil } from 'recoil-nexus';
import { BaseEditor, createEditor, Editor, Node, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { ReactEditor, withReact } from 'slate-react';

import { MYSELF_ID } from '@/faker/wechat/user';
import {
  conversationInputState,
  conversationInputValueState,
  conversationState,
  EConversationRole,
  EConversationType,
  fromLastGenerateUpperText,
  IConversationTypeRedPacket,
  IConversationTypeTransfer,
  recentUseEmojiState,
  TConversationItem,
} from '@/state/conversationState';
import { friendState, IProfile, myProfileState } from '@/state/profile';
import { animateElement } from '@/utils';
import { CustomElementEmoji } from '@/vite-env';
import { SLATE_INITIAL_VALUE, withInlines } from '@/wechatComponents/SlateText/utils';

interface IConversationAPIContext {
  conversationId: IProfile['id'];
  listRef: RefObject<HTMLDivElement>;
  scrollConversationListToBtm: () => void;
  inputEditor: BaseEditor & ReactEditor;
  insertEmojiNode: (emojiSymbol: string) => void;
  sendTextMessage: () => void;
  sendTickleText: (friendId: IProfile['id']) => void;
  sendTransfer: (data: Omit<IConversationTypeTransfer, 'id' | 'sendTimestamp' | 'upperText' | 'type'>) => void;
  sendRedPacketAcceptedReply: (redPacketId: IConversationTypeRedPacket['id']) => void;
  removeLastNode: () => void;
}

const ConversationAPIContext = createContext<IConversationAPIContext | null>(null);

export const ConversationAPIProvider = ({ children }: PropsWithChildren) => {
  const listRef = useRef<HTMLDivElement>(null);
  const inputEditor = useCreation(() => withInlines(withHistory(withReact(createEditor()))), []);
  const { id: conversationId = '' } = useParams();
  const setRecentUseEmoji = useSetRecoilState(recentUseEmojiState);

  const scrollConversationListToBtm = useCallback(() => {
    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollTop = 9999999;
      }
    });
  }, []);

  const insertEmojiNode = useCallback((emojiSymbol: string) => {
    // ReactEditor.focus(inputEditor);
    const emoji: CustomElementEmoji = { type: 'emoji', emojiSymbol, children: [{ text: '' }] };
    Transforms.insertNodes(inputEditor, emoji);
    Transforms.move(inputEditor, { distance: 2 });
  }, []);

  const sendTextMessage = useCallback(() => {
    const { sendRole } = getRecoil(conversationInputState);
    const value = getRecoil(conversationInputValueState);
    if (isEqual(value, SLATE_INITIAL_VALUE)) return;
    setRecoil(conversationState(conversationId), (prev) => {
      return [
        ...prev,
        {
          type: EConversationType.text,
          role: sendRole,
          textContent: value,
          id: nanoid(8),
          sendTimestamp: dayjs().valueOf(),
          upperText: fromLastGenerateUpperText(prev),
        },
      ] as TConversationItem[];
    });
    const pickedEmoji: string[] = [];
    for (const nodeEntry of Node.descendants(inputEditor)) {
      const [node] = nodeEntry;
      if ((node as CustomElementEmoji).type === 'emoji') {
        const { emojiSymbol } = node as CustomElementEmoji;
        pickedEmoji.push(emojiSymbol);
      }
    }
    setRecentUseEmoji((prev) => Array.from(new Set([...pickedEmoji, ...prev])).slice(0, 8));
    Transforms.delete(inputEditor, {
      at: {
        anchor: Editor.start(inputEditor, []),
        focus: Editor.end(inputEditor, []),
      },
    });
    scrollConversationListToBtm();
  }, [conversationId]);

  const sendTickleText = useCallback(
    throttle(
      (friendId: IProfile['id']) => {
        const friendProfile = getRecoil(friendState(friendId));
        const myProfile = getRecoil(myProfileState);
        let finalTickleText = '';
        if (friendId === MYSELF_ID) {
          finalTickleText = `我拍了拍自己${myProfile.tickleText ?? ''}`;
        } else {
          finalTickleText = `我拍了拍 "${friendProfile.nickname}" ${friendProfile.tickleText ?? ''}`;
        }
        setRecoil(conversationState(conversationId), (prev) => {
          return [
            ...prev,
            {
              type: EConversationType.centerText,
              id: nanoid(8),
              sendTimestamp: dayjs().valueOf(),
              role: EConversationRole.mine,
              simpleContent: finalTickleText,
              upperText: fromLastGenerateUpperText(prev),
              extraClassName: friendId === MYSELF_ID ? 'text-black/70 font-bold' : '',
            },
          ] as TConversationItem[];
        });
        animateElement('#screen', 'headShake');
        scrollConversationListToBtm();
      },
      1000,
      { trailing: false }
    ),
    [conversationId]
  );

  const sendTransfer = useCallback(
    (data: Parameters<IConversationAPIContext['sendTransfer']>[0]) => {
      setRecoil(conversationState(conversationId), (prev) => {
        return [
          ...prev,
          {
            type: EConversationType.transfer,
            id: nanoid(8),
            sendTimestamp: dayjs().valueOf(),
            upperText: fromLastGenerateUpperText(prev),
            ...data,
          },
        ] as TConversationItem[];
      });
    },
    [conversationId]
  );

  const sendRedPacketAcceptedReply = useCallback(
    (redPacketId: Parameters<IConversationAPIContext['sendRedPacketAcceptedReply']>[0]) => {
      setRecoil(conversationState(conversationId), (prev) => {
        return [
          ...prev,
          {
            type: EConversationType.redPacketAcceptedReply,
            id: nanoid(8),
            sendTimestamp: dayjs().valueOf(),
            upperText: fromLastGenerateUpperText(prev),
            redPacketId,
          },
        ] as TConversationItem[];
      });
    },
    [conversationId]
  );

  const removeLastNode = useCallback(async () => {
    Editor.deleteBackward(inputEditor, { unit: 'character' });
  }, []);

  const value: IConversationAPIContext = useMemo(() => {
    return {
      conversationId,
      listRef,
      scrollConversationListToBtm,
      inputEditor,
      insertEmojiNode,
      sendTextMessage,
      removeLastNode,
      sendTickleText,
      sendTransfer,
      sendRedPacketAcceptedReply,
    };
  }, []);
  return <ConversationAPIContext.Provider value={value}>{children}</ConversationAPIContext.Provider>;
};

export const useConversationAPI = () => useContext(ConversationAPIContext)!;
