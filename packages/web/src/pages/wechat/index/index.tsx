import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';

import PLUS_CIRCLE_SVG from '@/assets/plus-circle.svg';
import SearchOutlinedSVG from '@/assets/search-outlined.svg?react';
import { canBeDetected } from '@/components/NodeDetected';
import {} from '@/components/StatusBar';
import { BottomNavBars } from '@/state/btmNavbarsState';
import { MetaDataType } from '@/state/detectedNode';
import totalUnreadCountState from '@/state/totalUnreadCountState';
import BottomNavbar, { useToggleNavbarActivated } from '@/wechatComponents/BottomNavbar';

import DialogueList from './DialogueList';
import StateEffect from './StateEffect';

const WechatIndex = () => {
  const totalUnreadCount = useRecoilValue(totalUnreadCountState);
  const { t } = useTranslation();
  useToggleNavbarActivated(BottomNavBars.WECHAT);

  return (
    <>
      <StateEffect />
      <div className="grid grid-cols-3 bg-[rgba(237,237,237,1)] px-4 py-2">
        <div className="flex items-center space-x-1 text-xs font-bold" />
        <canBeDetected.span
          className="flex justify-center font-medium"
          metaData={{ type: MetaDataType.TotalUnreadCount, treeItemDisplayName: (d) => `顶栏 ${d.count} 个未读消息` }}
        >
          {t('wechatPage.main.title', {
            totalUnreadCount: totalUnreadCount.count,
          })}
        </canBeDetected.span>
        <div className="flex justify-end">
          <img src={PLUS_CIRCLE_SVG} className="w-4" />
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto bg-white">
        <div className="flex bg-[rgba(237,237,237,1)] px-2 pb-2">
          <div className="flex flex-1 items-center justify-center rounded-[4px] bg-white p-2 text-xs">
            <SearchOutlinedSVG fill="rgba(0, 0, 0, 0.5)" width={17} height={16} />
            <span className="ml-2 opacity-50">{t('wechatPage.main.search')}</span>
          </div>
        </div>
        <DialogueList />
      </div>
      <BottomNavbar />
    </>
  );
};

export default WechatIndex;
