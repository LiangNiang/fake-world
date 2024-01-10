import cn from 'classnames';
import { RenderElementProps, useSelected } from 'slate-react';
import { twMerge } from 'tailwind-merge';

import { CustomElementEmoji } from '@/vite-env';

import { EMOJI_ARRAY } from './utils';

export type TElementOtherProps = {
  readOnly?: boolean;
  classNames?: {
    base?: string;
    emojiClassName?: string;
  };
};

type ElementProps = RenderElementProps & TElementOtherProps;

export const InlineChromiumBugfix = () => (
  <span contentEditable={false} style={{ fontSize: 0 }}>
    {String.fromCodePoint(160)}
  </span>
);

export const EmojiElement = (props: ElementProps) => {
  const { element, attributes, children, readOnly, classNames } = props;
  const { emojiSymbol } = element as CustomElementEmoji;
  const [y, x] = emojiSymbol.split('-').map((v) => parseInt(v, 10));
  const selected = useSelected();

  const content = (
    <span
      {...attributes}
      contentEditable={false}
      className={cn('mx-[1px] inline-block h-6 w-6 origin-center bg-inherit bg-no-repeat', { '!bg-wechatBrand-5': selected })}
      style={{
        backgroundImage: `url(https://cdn-fakeworld.azureedge.net/fakeworld/emoji-sprite.png)`,
        ...EMOJI_ARRAY[y][x]?.preview,
      }}
      data-playwright-selected={selected}
    >
      <InlineChromiumBugfix />
      {children}
      <InlineChromiumBugfix />
    </span>
  );

  if (readOnly) {
    return <div className={twMerge('inline-block align-top text-base', classNames?.emojiClassName)}>{content}</div>;
  }
  return content;
};

export const Element = (props: ElementProps) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case 'emoji':
      return <EmojiElement {...props} />;
    default:
      return (
        <div {...attributes} className="selection:bg-wechatBrand-5">
          {children}
        </div>
      );
  }
};

export default Element;
