import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';

import AddFriendSVG from '@/assets/add-friend-outlined.svg?react';
import SearchOutlinedSVG from '@/assets/search-outlined.svg?react';
import { BottomNavBars } from '@/state/btmNavbarsState';
import { allFriendsAnchorDataState } from '@/state/profile';
import BottomNavbar, { useToggleNavbarActivated } from '@/wechatComponents/BottomNavbar';

import GroupBlock from './GroupBlock';
import Anchor from './RightAnchor';
import TopMenus from './TopMenus';
import Total from './Total';

const Contacts = () => {
  useToggleNavbarActivated(BottomNavBars.ADDRESS_BOOK);
  const { t } = useTranslation();

  const anchorData = useRecoilValue(allFriendsAnchorDataState);

  const groupRef = useRef<HTMLDivElement[]>([]);

  const getStuckInfo = () => {
    const newMap = new Map();
    anchorData.forEach((_, k) => newMap.set(k.toString(), false));
    return newMap;
  };

  const [stuckInfo, setStuckInfo] = useState<Map<string, boolean>>(() => getStuckInfo());

  useEffect(() => {
    setStuckInfo(getStuckInfo());
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

  return (
    <>
      <div className="grid grid-cols-3 justify-center bg-[rgba(237,237,237,1)] px-4 py-2">
        <div />
        <div className="flex items-center justify-center font-medium">{t('wechatPage.contacts.title')}</div>
        <div className="flex items-center justify-end">
          <AddFriendSVG height={20} width={20} fill="black" className="cursor-pointer" />
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto bg-white" id="contacts-container">
        <div className="flex bg-[rgba(237,237,237,1)] px-2 pb-3">
          <div className="flex flex-1 items-center justify-center rounded-[4px] bg-white p-2 text-xs">
            <SearchOutlinedSVG fill="rgba(0, 0, 0, 0.5)" width={17} height={16} />
            <span className="ml-2 opacity-50">{t('wechatPage.main.search')}</span>
          </div>
        </div>
        <TopMenus />
        {Array.from(anchorData, ([k, v], index) => (
          <GroupBlock
            key={k.toString()}
            title={k}
            data={v}
            ref={(el) => {
              groupRef.current[index] = el as HTMLDivElement;
            }}
            isStuck={!!stuckInfo.get(k.toString())}
          />
        ))}
        <Total />
      </div>

      <Anchor data={anchorData} stuckInfo={stuckInfo} />
      <BottomNavbar />
    </>
  );
};

export default Contacts;
