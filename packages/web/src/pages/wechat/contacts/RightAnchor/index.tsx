import { memo } from 'react';

import SearchOutlinedSVG from '@/assets/search-outlined.svg?react';
import { generateNameAnchorGroup, otherS, searchS, starS } from '@/state/profile';

import { findLastStuckKey } from '../utils';
import AnchorItem from './AnchorItem';

type Props = {
  data: ReturnType<typeof generateNameAnchorGroup>;
  stuckInfo: Map<string, boolean>;
  handleQuickJump: (key: string) => void;
};

const RightAnchor = ({ data, stuckInfo, handleQuickJump }: Props) => {
  const lastTrueKey = findLastStuckKey(stuckInfo);

  return (
    <div className="absolute right-2 top-1/2 z-20 flex -translate-y-1/2 select-none flex-col items-center text-xs">
      {Array.from(data, ([k, v]) => {
        if (k === searchS)
          return (
            <AnchorItem key="search">
              <SearchOutlinedSVG width={14} fill="black" />
            </AnchorItem>
          );
        if (v.length === 0) return null;
        if (k === starS) {
          return (
            <AnchorItem key="star" active={lastTrueKey === starS.toString()} onClick={() => handleQuickJump(starS.toString())}>
              &#x2606;
            </AnchorItem>
          );
        }
        if (k === otherS) {
          return (
            <AnchorItem key="other" active={lastTrueKey === otherS.toString()} onClick={() => handleQuickJump(otherS.toString())}>
              #
            </AnchorItem>
          );
        }
        return (
          <AnchorItem className="font-mono" key={k as string} active={lastTrueKey === k} onClick={() => handleQuickJump(k as string)}>
            {k as string}
          </AnchorItem>
        );
      })}
    </div>
  );
};

export default memo(RightAnchor);
