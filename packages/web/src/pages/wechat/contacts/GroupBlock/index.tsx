import { isSymbol } from 'lodash-es';
import { forwardRef } from 'react';
import { twJoin } from 'tailwind-merge';

import { otherS, searchS, starS, TNeedGroupDataItem } from '@/state/profile';

import FriendList from '../FriendList';

type Props = {
  title: string | symbol;
  data: TNeedGroupDataItem[];
  isStuck: boolean;
};

const GroupBlock = forwardRef<HTMLDivElement, Props>(({ title, data, isStuck }, ref) => {
  const renderTitle = () => {
    if (isSymbol(title)) {
      switch (title) {
        case starS:
          return <span>&#x2606; 星标朋友</span>;
        case otherS:
          return <span>#</span>;
        default:
          return null;
      }
    }
    return <span>{title}</span>;
  };

  if (data.length === 0 || title === searchS) return null;

  return (
    <>
      <div
        data-key={title.toString()}
        ref={ref}
        className={twJoin(
          'sticky top-0 z-10 mb-1 ml-3 mt-4 bg-white py-1 text-black/60',
          isStuck &&
            'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:origin-top-left after:scale-y-50 after:border-t after:border-black/10'
        )}
      >
        {renderTitle()}
      </div>
      <FriendList data={data} />
    </>
  );
});

GroupBlock.displayName = 'GroupBlock';

export default GroupBlock;
