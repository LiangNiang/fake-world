import { isEqual } from 'lodash-es';
import { MouseEvent as ReactMouseEvent, useCallback, useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import LikeOutlinedSVG from '@/assets/like-outlined.svg?react';
import SearchOutlinedSVG from '@/assets/search-outlined.svg?react';
import SELFIE_EXPRESSION_IMG from '@/assets/selfie-expression.png';
import StickerOutlinedSVG from '@/assets/sticker-outlined.svg?react';
import { conversationInputValueState } from '@/state/conversationState';
import { SLATE_INITIAL_VALUE } from '@/wechatComponents/SlateText/utils';

import { useConversationAPI } from '../../context';
import { usePopup } from '../BottomPopup';
import EmojiList from './EmojiList';
import FloatingButtons from './FloatingButtons';

const EmojiPanel = () => {
  const { enteringStatusCallback, nodeRef } = usePopup();
  const { insertEmojiNode, scrollConversationListToBtm } = useConversationAPI();
  const inputValue = useRecoilValue(conversationInputValueState);

  const isInitial = isEqual(inputValue, SLATE_INITIAL_VALUE);

  useEffect(() => {
    const rmEnteredCB = enteringStatusCallback.setCallback(scrollConversationListToBtm);

    return () => {
      rmEnteredCB();
    };
  });

  const handler = useCallback((ev: MouseEvent) => {
    ev.preventDefault();
    const height = nodeRef.current!.offsetHeight;
    const res = height - ev.movementY;
    if (res <= 570 && res >= 300) {
      nodeRef.current!.style.height = `${res}px`;
    }
  }, []);

  const handleMouseDown = () => {
    const screen = document.getElementById('screen')!;
    screen.addEventListener('mousemove', handler);
    screen.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseUp = useCallback(() => {
    const screen = document.getElementById('screen')!;
    screen.removeEventListener('mousemove', handler);
    screen.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const handleEmojiClick = (ev: ReactMouseEvent) => {
    const emojiSymbol = (ev.target as HTMLDivElement).getAttribute('data-key');
    if (emojiSymbol) {
      insertEmojiNode(emojiSymbol);
    }
  };

  return (
    <div className="flex max-h-full select-none flex-col">
      <div className="flex items-center space-x-[10px] bg-[#F6F6F6] px-4 py-[6px]">
        <div className="cursor-pointer rounded p-[6px]">
          <SearchOutlinedSVG className="h-6 w-6" fill="black" />
        </div>
        <div className="cursor-pointer rounded bg-white p-[6px]">
          <StickerOutlinedSVG className="h-6 w-6" fill="black" />
        </div>
        <div className="cursor-pointer rounded p-[6px]">
          <LikeOutlinedSVG className="h-6 w-6" fill="black" />
        </div>
        <div className="cursor-pointer rounded p-[6px]">
          <img src={SELFIE_EXPRESSION_IMG} className="h-6 w-6 origin-center scale-90" />
        </div>
      </div>
      <div className="flex w-full justify-center bg-[#ECECEC]">
        <div className="cursor-row-resize py-3" onMouseDown={handleMouseDown}>
          <div className="h-1 w-12 rounded bg-[#D1CFD0]"></div>
        </div>
      </div>
      <EmojiList onEmojiClick={handleEmojiClick} />
      <FloatingButtons disabled={isInitial} />
    </div>
  );
};

export default EmojiPanel;
