import cn from 'classnames';
import { MouseEvent, useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { recentUseEmojiState } from '@/state/conversationState';
import { EMOJI_ARRAY } from '@/wechatComponents/SlateText/utils';

type Props = {
  onEmojiClick: (ev: MouseEvent) => void;
  className?: string;
};

const EmojiList = ({ onEmojiClick, className }: Props) => {
  const recentUseEmoji = useRecoilValue(recentUseEmojiState);

  const recentUseEmojiContent = useMemo(() => {
    if (recentUseEmoji.length === 0) return null;
    return (
      <div className="flex flex-col">
        <div className="mb-4 text-xs">最近使用</div>
        <div className="flex justify-between" onClick={onEmojiClick}>
          {recentUseEmoji.map((item) => {
            const [y, x] = item.split('-').map((i) => parseInt(i));
            return (
              <div
                key={`${y}-${x}`}
                data-key={`${y}-${x}`}
                className="h-6 w-6 origin-center cursor-pointer bg-no-repeat"
                style={{
                  backgroundImage: `url(https://cdn-fakeworld.azureedge.net/fakeworld/emoji-sprite.png)`,
                  ...EMOJI_ARRAY[y][x]!.panel,
                }}
              />
            );
          })}
          {new Array(8 - recentUseEmoji.length).fill(0).map((_, i) => (
            <div key={`empty-${i}`} className="h-6 w-6" />
          ))}
        </div>
      </div>
    );
  }, [recentUseEmoji]);

  return (
    <div className={cn('flex flex-col overflow-auto bg-[#ECECEC] px-4 pb-8', className)}>
      {recentUseEmojiContent}
      <div className="my-4 text-xs">所有表情</div>
      <div className="flex flex-col space-y-4" onClick={onEmojiClick}>
        {EMOJI_ARRAY.map((y, yi) => {
          return (
            <div className="flex justify-between" key={`y-${yi}`}>
              {y.map((style, xi) => {
                return (
                  <div
                    key={`${yi}-${xi}`}
                    data-key={style ? `${yi}-${xi}` : null}
                    className={cn('h-6 w-6 origin-center bg-inherit bg-no-repeat', { 'cursor-pointer': style })}
                    style={{
                      backgroundImage: style ? `url(https://cdn-fakeworld.azureedge.net/fakeworld/emoji-sprite.png)` : undefined,
                      ...style?.panel,
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmojiList;
