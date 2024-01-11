import { isSymbol } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { twJoin } from 'tailwind-merge';

import AddFriendSVG from '@/assets/add-friend-outlined.svg?react';
import SearchOutlinedSVG from '@/assets/search-outlined.svg?react';
import { BottomNavBars } from '@/state/btmNavbarsState';
import { MetaDataType } from '@/state/detectedNode';
import { allFriendsAnchorDataState, otherS, starS, TGroupedDataItem } from '@/state/profile';
import BottomNavbar, { useToggleNavbarActivated } from '@/wechatComponents/BottomNavbar';
import UserAvatar from '@/wechatComponents/User/UserAvatar';

import { UniversalList } from './FriendList/UniversalComponent';
import Anchor from './RightAnchor';
import TopMenus from './TopMenus';
import Total from './Total';
import { groupedMapToRenderArray } from './utils';

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

  const renderTitle = (title: string | symbol) => {
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

  const renderArray = groupedMapToRenderArray(anchorData);

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
        {renderArray.map((v, i) => {
          if ('type' in v && v.type === 'title') {
            const isStuck = !!stuckInfo.get(v.title.toString());
            return (
              <div
                data-key={v.title.toString()}
                key={v.title.toString()}
                className={twJoin(
                  'sticky top-0 z-10 mb-1 ml-3 mt-4 bg-white py-1 text-black/60',
                  isStuck &&
                    'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:origin-top-left after:scale-y-50 after:border-t after:border-black/10'
                )}
                ref={(el) => {
                  groupRef.current[i] = el as HTMLDivElement;
                }}
              >
                {renderTitle(v.title)}
              </div>
            );
          } else {
            const { id, name, __key } = v as TGroupedDataItem;
            return (
              <UniversalList.CanBeDetectedItem
                textPrev={<UserAvatar size="small" id={id} className="mr-3" />}
                metaData={{ type: MetaDataType.FirendProfile, index: id }}
                key={__key}
              >
                {name}
              </UniversalList.CanBeDetectedItem>
            );
          }
        })}
        <Total />
      </div>

      <Anchor data={anchorData} stuckInfo={stuckInfo} />
      <BottomNavbar />
    </>
  );
};

export default Contacts;
