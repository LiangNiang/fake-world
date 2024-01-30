import { css } from '@emotion/react';
import { useDebounceFn } from 'ahooks';
import { CSSProperties, MouseEventHandler, PropsWithChildren, ReactNode } from 'react';
import { useRecoilValue } from 'recoil';
import { getRecoil } from 'recoil-nexus';
import { twMerge } from 'tailwind-merge';

import { h } from '@/components/HashAssets';
import useModeNavigate from '@/components/useModeNavigate';
import { IConversationItemBase } from '@/state/conversationState';
import { ModeState, modeState } from '@/state/globalConfig';
import { friendState, IProfile } from '@/state/profile';

import { useConversationAPI } from '../../context';

type Props = {
  upperText: IConversationItemBase['upperText'];
  senderId: IProfile['id'];
  innerBlockClassName?: string;
  blockClassName?: string;
  blockStyle?: CSSProperties;
  extraElement?: ReactNode;
};

const CommonBlock = ({ upperText, senderId, children, innerBlockClassName, blockClassName, blockStyle, extraElement }: PropsWithChildren<Props>) => {
  const { avatarInfo } = useRecoilValue(friendState(senderId));
  const navigate = useModeNavigate({ silence: true });
  const { sendTickleText } = useConversationAPI();

  const handleClick: MouseEventHandler<HTMLImageElement> = (ev) => {
    const { detail: count } = ev;
    if (count === 2) {
      handleDoubliClick();
    } else if (count === 1) {
      navigate(`/wechat/friend/${senderId}`);
    }
  };

  const handleDoubliClick = () => {
    if (getRecoil(modeState) === ModeState.EDIT) return;
    sendTickleText(senderId);
  };

  const { run: debouncedHandleClick } = useDebounceFn(handleClick, { wait: 200 });

  return (
    <>
      {upperText && <div className="m-auto text-xs text-black/50">{upperText}</div>}
      <div
        className={twMerge(
          'relative flex max-w-[85%] space-x-3 group-[.mine]:ml-auto group-[.mine]:flex-row-reverse group-[.mine]:space-x-reverse',
          blockClassName
        )}
        style={blockStyle}
      >
        <h.img src={avatarInfo} className="h-10 w-10 cursor-pointer rounded" onClick={debouncedHandleClick} />
        <div
          css={css`
            &::before {
              clip-path: polygon(0% 50%, 50% 100%, 0% 100%);
            }
          `}
          className={twMerge(
            'relative max-w-[85%] break-words rounded p-[10px] before:absolute before:top-[6px] before:h-7 before:w-7 before:rounded-sm group-[.friend]:before:-left-[1px] group-[.mine]:before:-right-[1px] group-[.friend]:before:rotate-45 group-[.mine]:before:-rotate-[135deg]',
            innerBlockClassName
          )}
        >
          {children}
        </div>
        {extraElement}
      </div>
    </>
  );
};

export default CommonBlock;
