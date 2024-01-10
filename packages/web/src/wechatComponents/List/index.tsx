import cn from 'classnames';
import { omit } from 'lodash-es';
import { ComponentPropsWithRef, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import ArrowOutlinedSVG from '@/assets/arrow-outlined.svg?react';
import { canBeDetected } from '@/components/NodeDetected';

type ListItemProps = {
  withJump?: boolean;
  icon?: ReactNode;
  textPrev?: ReactNode;
  listItemClassName?: string;
};

export const List = ({ children, className }: ComponentPropsWithRef<'div'>) => {
  return <div className={cn('flex flex-col bg-white', className)}>{children}</div>;
};

const ListItemPrev = ({ children, className }: ComponentPropsWithRef<'div'>) => {
  return <div className={twMerge('ml-3', className)}>{children}</div>;
};

export const ListItem = ({
  children,
  className,
  withJump,
  icon,
  textPrev,
  listItemClassName,
  ...rest
}: ComponentPropsWithRef<'div'> & ListItemProps) => {
  const renderTextPrevNode = () => {
    if (icon) {
      return <ListItemPrev className="mr-4 flex h-6 w-6 items-center justify-center">{icon}</ListItemPrev>;
    }
    if (textPrev) {
      return <ListItemPrev className={listItemClassName}>{textPrev}</ListItemPrev>;
    }
    return <ListItemPrev />;
  };

  return (
    <div
      className={cn('group/item relative flex items-center', { 'cursor-pointer': withJump || rest.onClick }, className)}
      {...omit(rest, 'className', 'children')}
    >
      {renderTextPrevNode()}
      <div
        className={cn(
          'relative flex flex-1 items-center py-3 pr-3 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:origin-top-left after:scale-y-50 after:border-t after:border-black/10 group-last/item:after:hidden'
        )}
      >
        <div className="flex-1">{children}</div>
        <div className="ml-auto">{withJump && <ArrowOutlinedSVG fill="rgba(0,0,0,0.3)" className="ml-1 w-[18px]" />}</div>
      </div>
    </div>
  );
};

List.Item = ListItem;
List.CanBeDetectedItem = canBeDetected(ListItem);

export default List;
