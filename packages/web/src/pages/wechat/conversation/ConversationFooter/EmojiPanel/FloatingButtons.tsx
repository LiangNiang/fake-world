import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import BackspaceSVG from '@/assets/backspace.svg?react';

import { useConversationAPI } from '../../context';
import { usePopup } from '../BottomPopup';

type Props = {
  disabled: boolean;
};

const FloatingButtons = ({ disabled }: Props) => {
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);
  const { enteredStatusCallback, exitStatusCallback } = usePopup();
  const { sendTextMessage, removeLastNode } = useConversationAPI();

  useEffect(() => {
    const trueFn = () => setShowFloatingBtn(true);
    const falseFn = () => setShowFloatingBtn(false);

    const rmEnteredCB = enteredStatusCallback.setCallback(trueFn);
    const rmExitCB = exitStatusCallback.setCallback(falseFn);

    return () => {
      rmEnteredCB();
      rmExitCB();
    };
  }, []);

  if (!showFloatingBtn) return null;

  return (
    <div className="absolute bottom-3 right-2 flex select-none justify-end space-x-2">
      <div
        className={twMerge(
          'inline-flex h-10 cursor-pointer items-center rounded-md bg-white px-4 text-black',
          disabled && 'cursor-not-allowed text-black/30'
        )}
        onClick={disabled ? undefined : removeLastNode}
      >
        <BackspaceSVG fill="currentcolor" />
      </div>
      <div
        className={twMerge(
          'inline-flex h-10 cursor-pointer items-center rounded-md bg-wechatBrand-3 px-4 text-white',
          disabled && 'cursor-not-allowed bg-white text-black/30'
        )}
        onClick={disabled ? undefined : sendTextMessage}
      >
        发送
      </div>
    </div>
  );
};

export default FloatingButtons;
