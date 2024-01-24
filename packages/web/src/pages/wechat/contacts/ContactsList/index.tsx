import { useUpdateEffect } from 'ahooks';
import { Dispatch, memo, SetStateAction, useEffect, useRef } from 'react';

import { TNeedGroupDataItem } from '@/state/profile';

import { findLastStuckKey, getStuckInfo, groupedMapToRenderArray, isBefore } from '../utils';
import AnchorLabel from './AnchorLabel';
import UserItem from './UserItem';

type Props = {
  anchorData: Map<string | symbol, TNeedGroupDataItem[]>;
  stuckInfo: Map<string, boolean>;
  setStuckInfo: Dispatch<SetStateAction<Map<string, boolean>>>;
};

const ContactsList = ({ anchorData, stuckInfo, setStuckInfo }: Props) => {
  const groupRef = useRef<HTMLDivElement[]>([]);

  const renderArray = groupedMapToRenderArray(anchorData);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const res: Record<string, boolean> = {};
        for (const el of entries) {
          const { target, isIntersecting } = el;
          const k = target.getAttribute('data-key')!;
          if (isIntersecting) {
            res[k] = true;
          } else {
            res[k] = false;
          }
        }
        setStuckInfo((prev) => {
          const newMap = new Map(prev);
          for (const k in res) {
            newMap.set(k, res[k]);
          }
          return newMap;
        });
      },
      {
        root: document.getElementById('contacts-container'),
        rootMargin: '0px 0px -100% 0px',
      }
    );
    for (const el of groupRef.current) {
      if (el) {
        io.observe(el);
      }
    }
    return () => {
      io.disconnect();
    };
  }, [anchorData]);

  useUpdateEffect(() => {
    setStuckInfo(getStuckInfo(anchorData));
  }, [anchorData]);

  return renderArray.map((v, i) => {
    const { type, _key } = v;
    if (type === 'anchor') {
      const { title } = v;
      const stuckKey = findLastStuckKey(stuckInfo);
      const isStuck = stuckKey === _key;
      const isBeforeStuck = stuckKey ? isBefore(stuckInfo, _key, stuckKey) : false;
      return (
        <AnchorLabel
          key={_key}
          labelKey={_key}
          labelTitle={title}
          isStuck={isStuck}
          isBeforeStuck={isBeforeStuck}
          ref={(el) => {
            groupRef.current[i] = el as HTMLDivElement;
          }}
        />
      );
    } else {
      return <UserItem key={_key} {...v} />;
    }
  });
};

export default memo(ContactsList);
