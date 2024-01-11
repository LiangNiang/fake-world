import { useMount, useScroll } from 'ahooks';
import { isSymbol } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { twMerge } from 'tailwind-merge';

import AddFriendSVG from '@/assets/add-friend-outlined.svg?react';
import SearchOutlinedSVG from '@/assets/search-outlined.svg?react';
import useModeNavigate from '@/components/useModeNavigate';
import { MYSELF_ID } from '@/faker/wechat/user';
import { BottomNavBars } from '@/state/btmNavbarsState';
import { MetaDataType } from '@/state/detectedNode';
import { allFriendsAnchorDataState, otherS, starS } from '@/state/profile';
import BottomNavbar, { useToggleNavbarActivated } from '@/wechatComponents/BottomNavbar';
import List from '@/wechatComponents/List';
import UserAvatar from '@/wechatComponents/User/UserAvatar';

import Anchor from './RightAnchor';
import TopMenus from './TopMenus';
import Total from './Total';
import { findLastStuckKey, groupedMapToRenderArray } from './utils';

const DATA_WHEEL_ID = 'contactsLayout';

const Contacts = () => {
  useToggleNavbarActivated(BottomNavBars.ADDRESS_BOOK);
  const { t } = useTranslation();
  const navigate = useModeNavigate();

  const anchorData = useRecoilValue(allFriendsAnchorDataState);

  const scrollRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement[]>([]);

  const scroll = useScroll(scrollRef);

  const getScrollDataAndSave = () => {
    if (scroll) {
      const { top } = scroll;
      localStorage.setItem(DATA_WHEEL_ID, JSON.stringify({ top }));
    }
  };

  useMount(() => {
    const { top } = JSON.parse(localStorage.getItem(DATA_WHEEL_ID) || '{}');
    if (top) {
      scrollRef.current?.scrollTo({ top });
    }
  });

  useEffect(() => {
    getScrollDataAndSave();
  }, [scroll]);

  const getStuckInfo = () => {
    const newMap = new Map();
    anchorData.forEach((_, k) => newMap.set(k.toString(), false));
    return newMap;
  };

  const [stuckInfo, setStuckInfo] = useState<Map<string, boolean>>(() => getStuckInfo());
  const [quickJump, setQuickJump] = useState<[boolean, string]>([false, '']);

  useEffect(() => {
    const [isQuickJump, key] = quickJump;
    if (isQuickJump) {
      const el = document.getElementById(key);
      if (el) {
        el.scrollIntoView();
      }
      setQuickJump([false, '']);
    }
  }, [quickJump]);

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
          return <span>&#x2606; {t('wechatPage.contacts.starred')}</span>;
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
      <div className="flex flex-1 flex-col overflow-y-auto bg-white" id="contacts-container" ref={scrollRef} data-wheel-id={DATA_WHEEL_ID}>
        <div className="flex bg-[rgba(237,237,237,1)] px-2 pb-3">
          <div className="flex flex-1 items-center justify-center rounded-[4px] bg-white p-2 text-xs">
            <SearchOutlinedSVG fill="rgba(0, 0, 0, 0.5)" width={17} height={16} />
            <span className="ml-2 opacity-50">{t('wechatPage.main.search')}</span>
          </div>
        </div>
        <TopMenus />
        {renderArray.map((v, i) => {
          const { type, _key } = v;
          if (type === 'anchor') {
            const { title } = v;
            const isStuck = findLastStuckKey(stuckInfo) === _key;
            return (
              <div
                data-key={_key}
                key={_key}
                className={twMerge(
                  'sticky top-0 z-10 mb-1 ml-4 mt-4 bg-white py-[2px] text-sm font-medium text-black/60',
                  isStuck &&
                    'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:origin-top-left after:scale-y-50 after:border-t after:border-black/10',
                  quickJump[0] && 'static'
                )}
                ref={(el) => {
                  groupRef.current[i] = el as HTMLDivElement;
                }}
                id={_key}
              >
                {renderTitle(title)}
              </div>
            );
          } else {
            const { id, name } = v;
            return (
              <List.CanBeDetectedItem
                textPrev={<UserAvatar size="small" id={id} className="mr-3" />}
                metaData={
                  id === MYSELF_ID
                    ? { type: MetaDataType.MyProfile, treeItemDisplayName: '我自己' }
                    : { type: MetaDataType.FirendProfile, index: id, treeItemDisplayName: () => `好友（${name}）` }
                }
                listItemClassName="ml-4"
                key={_key}
                className="cursor-pointer"
                onClick={() => navigate(`/wechat/friend/${id}`)}
              >
                {name}
              </List.CanBeDetectedItem>
            );
          }
        })}
        <Total />
      </div>

      <Anchor
        data={anchorData}
        stuckInfo={stuckInfo}
        handleQuickJump={(key) => {
          setQuickJump([true, key]);
        }}
      />
      <BottomNavbar />
    </>
  );
};

export default Contacts;
