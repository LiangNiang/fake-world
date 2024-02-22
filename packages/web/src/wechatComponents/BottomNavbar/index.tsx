/* eslint-disable complexity */
import { mapValues } from 'lodash-es';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { twJoin } from 'tailwind-merge';

import AddressBookFilledSVG from '@/assets/address-book-filled.svg?react';
import AddressBookOutlinedSVG from '@/assets/address-book-outlined.svg?react';
import DiscoverFilledSVG from '@/assets/discover-filled.svg?react';
import DiscoverOutlinedSVG from '@/assets/discover-outlined.svg?react';
import PeopleFilledSVG from '@/assets/people-filled.svg?react';
import PeopleOutlinedSVG from '@/assets/people-outlined.svg?react';
import WechatSVG from '@/assets/wechat.svg?react';
import Badge from '@/components/Badge';
import { canBeDetected } from '@/components/NodeDetected';
import TopOperations from '@/components/TopOperations';
import btmNavbarsState, { BottomNavBars } from '@/state/btmNavbarsState';
import { MetaDataType } from '@/state/detectedNode';

const commonOperations = [
  {
    onClick: TopOperations.OperationSelectParent.selectParentNode,
    element: <TopOperations.OperationSelectParent />,
  },
];

export const useToggleNavbarActivated = (index: BottomNavBars) => {
  const setBottomNavbars = useSetRecoilState(btmNavbarsState);

  useEffect(() => {
    setBottomNavbars((prev) => mapValues(prev, (v, k) => ({ ...v, activated: k === index })));
  }, [index]);
};

const BottomNavbar = () => {
  const bottomNavbars = useRecoilValue(btmNavbarsState);
  const { WECHAT, ADDRESS_BOOK, DISCOVER, MY } = bottomNavbars;
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <canBeDetected.div className="grid grid-cols-4 bg-[#f8f8f8]" metaData={{ treeItemDisplayName: '底部导航栏' }}>
      <canBeDetected.div
        className="flex cursor-pointer flex-col items-center justify-center space-y-1 py-2"
        metaData={{
          type: MetaDataType.NavigationBar,
          index: BottomNavBars.WECHAT,
          treeItemDisplayName: '微信',
          operations: commonOperations,
        }}
        onClick={() => {
          navigate('/wechat');
        }}
      >
        <Badge
          text={WECHAT.badgeNumber}
          type={WECHAT.badgeType}
          className={WECHAT.badgeType === 'dot' ? 'right-0 top-0' : '-right-3'}
          hidden={WECHAT.badgeHide}
        >
          <WechatSVG className="h-7 w-7" fill={WECHAT.activated ? '#39CD80' : 'white'} stroke={WECHAT.activated ? 'unset' : 'black'} />
        </Badge>
        <span className={twJoin('text-xs', WECHAT.activated && 'text-[#07C160]')}>{t('wechatPage.bottomNavbar.wechat')}</span>
      </canBeDetected.div>
      <canBeDetected.div
        className="flex cursor-pointer flex-col items-center justify-center space-y-1 py-2"
        metaData={{
          type: MetaDataType.NavigationBar,
          index: BottomNavBars.ADDRESS_BOOK,
          treeItemDisplayName: '通讯录',
          operations: commonOperations,
        }}
        onClick={() => {
          navigate('/wechat/contacts');
        }}
      >
        <Badge
          text={ADDRESS_BOOK.badgeNumber}
          type={ADDRESS_BOOK.badgeType}
          className={ADDRESS_BOOK.badgeType === 'dot' ? '-right-1 top-0' : '-right-3'}
          hidden={ADDRESS_BOOK.badgeHide}
        >
          {ADDRESS_BOOK.activated ? (
            <AddressBookFilledSVG fill="#39CD80" className="h-7 w-7" />
          ) : (
            <AddressBookOutlinedSVG className="h-7 w-7" fill="black" />
          )}
        </Badge>
        <span className={twJoin('text-xs', ADDRESS_BOOK.activated && 'text-[#07C160]')}>{t('wechatPage.bottomNavbar.contacts')}</span>
      </canBeDetected.div>
      <canBeDetected.div
        className="flex cursor-pointer flex-col items-center justify-center space-y-1 py-2"
        metaData={{
          type: MetaDataType.NavigationBar,
          index: BottomNavBars.DISCOVER,
          treeItemDisplayName: '发现',
          operations: commonOperations,
        }}
        onClick={() => {
          navigate('/wechat/discover');
        }}
      >
        <Badge
          text={DISCOVER.badgeNumber}
          type={DISCOVER.badgeType}
          className={DISCOVER.badgeType === 'dot' ? 'right-0 top-0' : '-right-3'}
          hidden={DISCOVER.badgeHide}
        >
          {DISCOVER.activated ? <DiscoverFilledSVG fill="#39CD80" className="h-7 w-7" /> : <DiscoverOutlinedSVG className="h-7 w-7" fill="black" />}
        </Badge>
        <span className={twJoin('text-xs', DISCOVER.activated && 'text-[#07C160]')}>{t('wechatPage.bottomNavbar.discover')}</span>
      </canBeDetected.div>
      <canBeDetected.div
        className="flex cursor-pointer flex-col items-center justify-center space-y-1 py-2"
        metaData={{
          type: MetaDataType.NavigationBar,
          index: BottomNavBars.MY,
          treeItemDisplayName: '我',
          operations: commonOperations,
        }}
        onClick={() => {
          navigate('/wechat/my');
        }}
      >
        <Badge text={MY.badgeNumber} type={MY.badgeType} className={MY.badgeType === 'dot' ? 'right-0 top-0' : '-right-3'} hidden={MY.badgeHide}>
          {MY.activated ? <PeopleFilledSVG fill="#39CD80" className="h-7 w-7" /> : <PeopleOutlinedSVG className="h-7 w-7" fill="black" />}
        </Badge>
        <span className={twJoin('text-xs', MY.activated && 'text-[#07C160]')}>{t('wechatPage.bottomNavbar.me')}</span>
      </canBeDetected.div>
    </canBeDetected.div>
  );
};

export default BottomNavbar;
