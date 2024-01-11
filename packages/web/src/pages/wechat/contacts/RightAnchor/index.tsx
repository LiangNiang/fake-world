import { memo, useState } from 'react';

import SearchOutlinedSVG from '@/assets/search-outlined.svg?react';

import { generateNameAnchorGroup, otherS, searchS, starS } from '../utils';
import AnchorItem from './AnchorItem';

type Props = {
  data: ReturnType<typeof generateNameAnchorGroup>;
};

const RightAnchor = ({ data }: Props) => {
  const [activeKey, setActiveKey] = useState<string | null | symbol>(null);

  return (
    <div className="absolute right-2 top-1/2 flex -translate-y-1/2 select-none flex-col items-center text-xs">
      {Array.from(data, ([k]) => {
        if (k === searchS)
          return (
            <AnchorItem key="search">
              <SearchOutlinedSVG width={14} fill="black" />
            </AnchorItem>
          );
        if (data.get(k)?.length === 0) return null;
        if (k === starS) {
          return (
            <AnchorItem key="star" active={activeKey === starS} onClick={() => setActiveKey(starS)}>
              &#x2606;
            </AnchorItem>
          );
        }
        if (k === otherS) {
          return (
            <AnchorItem key="other" active={activeKey === otherS} onClick={() => setActiveKey(otherS)}>
              #
            </AnchorItem>
          );
        }
        return (
          <AnchorItem className="font-mono" key={k as string} active={activeKey === k} onClick={() => setActiveKey(k)}>
            {k as string}
          </AnchorItem>
        );
      })}
    </div>
  );
};

export default memo(RightAnchor);
