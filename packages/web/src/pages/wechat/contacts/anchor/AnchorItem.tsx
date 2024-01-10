import { omit } from 'lodash-es';
import { ComponentProps } from 'react';
import { twJoin } from 'tailwind-merge';

type Props = {
  active?: boolean;
};

const AnchorItem = ({ active, children, className, ...rest }: ComponentProps<'div'> & Props) => {
  return (
    <div
      {...omit(rest, 'key')}
      className={twJoin('flex items-center justify-center rounded-full px-1', active && 'bg-wechatBrand-1 text-white', className)}
    >
      {children}
    </div>
  );
};

export default AnchorItem;
