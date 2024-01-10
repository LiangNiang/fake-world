import cn from 'classnames';
import { isNil } from 'lodash-es';
import { CSSProperties, PropsWithChildren } from 'react';

type Props = {
  type?: 'number' | 'dot';
  className?: string;
  text?: number;
  style?: CSSProperties;
  hidden?: boolean;
};

const Badge = ({ type = 'number', style, text, className, children, hidden }: PropsWithChildren<Props>) => {
  if (hidden || (isNil(text) && type === 'number')) {
    return <>{children}</>;
  }
  const isOneText = text?.toString().length === 1;
  return (
    <div className="relative">
      {children}
      {type === 'dot' && <div className={cn('absolute -right-1 -top-1 h-[10px] w-[10px] rounded-full bg-red-500', className)} style={style}></div>}
      {type === 'number' && (
        <div
          className={cn(
            'absolute -right-2 -top-2 flex items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white',
            {
              'h-[18px] w-[18px] leading-[18px]': isOneText,
              'px-1': !isOneText,
            },
            className
          )}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Badge;
