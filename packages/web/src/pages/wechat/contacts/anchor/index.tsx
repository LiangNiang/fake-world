import { memo, useState } from 'react';

import { generateNameAnchorGroup, otherS, starS, topS } from '../utils';
import AnchorItem from './AnchorItem';

type Props = {
  data: ReturnType<typeof generateNameAnchorGroup>;
};

const Anchor = ({ data }: Props) => {
  const [activeKey, setActiveKey] = useState<string | null | symbol>(null);

  return (
    <div className="absolute right-2 top-1/2 flex -translate-y-1/2 flex-col items-center space-y-[2px] text-xs">
      {Array.from(data, ([k]) => {
        if (k === topS) {
          return <AnchorItem key="top">&#8593;</AnchorItem>;
        }
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

export default memo(Anchor);
