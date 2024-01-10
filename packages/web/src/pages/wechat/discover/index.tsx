import { useTranslation } from 'react-i18next';

import FloatWindowOnOutlinedSVG from '@/assets/float-window-on-outlined.svg?react';
import GamesSVG from '@/assets/games.svg?react';
import MiniProgramOutlinedSVG from '@/assets/mini-program-2-outlined.svg?react';
import MomentSVG from '@/assets/moment.svg?react';
import NewsOutlinedSVG from '@/assets/news-outlined.svg?react';
import ScanOutlinedSVG from '@/assets/scan-outlined.svg?react';
import SearchLogoOutlinedSVG from '@/assets/search-logo-outlined.svg?react';
import useModeNavigate from '@/components/useModeNavigate';
import { BottomNavBars } from '@/state/btmNavbarsState';
import BottomNavbar, { useToggleNavbarActivated } from '@/wechatComponents/BottomNavbar';
import List from '@/wechatComponents/List';

import FjSVG from './assets/fj.svg?react';
import SphSVG from './assets/sph.svg?react';

const Discover = () => {
  const navigate = useModeNavigate();
  const { t } = useTranslation();
  useToggleNavbarActivated(BottomNavBars.DISCOVER);

  return (
    <>
      <div className="flex justify-center bg-[rgba(237,237,237,1)] py-2 font-medium">{t('wechatPage.discover.title')}</div>
      <div className="flex flex-1 flex-col bg-[rgba(237,237,237,1)]">
        <List>
          <List.Item withJump icon={<MomentSVG />} onClick={() => navigate('/wechat/moments')}>
            {t('wechatPage.discover.moments')}
          </List.Item>
        </List>
        <List className="mt-1.5">
          <List.Item withJump icon={<SphSVG fill="#F79D3D" className="origin-center scale-80" />}>
            {t('wechatPage.discover.channels')}
          </List.Item>
          <List.Item withJump icon={<FloatWindowOnOutlinedSVG fill="#D56F68" />}>
            {t('wechatPage.discover.live')}
          </List.Item>
        </List>
        <List className="mt-1.5">
          <List.Item withJump icon={<ScanOutlinedSVG fill="#2A7FCB" className="origin-center scale-90" />}>
            {t('wechatPage.discover.scan')}
          </List.Item>
        </List>
        <List className="mt-1.5">
          <List.Item withJump icon={<NewsOutlinedSVG fill="#FAB93F" />}>
            {t('wechatPage.discover.topStories')}
          </List.Item>
          <List.Item withJump icon={<SearchLogoOutlinedSVG fill="#F35967" className="origin-center scale-95" />}>
            {t('wechatPage.discover.search')}
          </List.Item>
        </List>
        <List className="mt-1.5">
          <List.Item withJump icon={<FjSVG fill="#4383D3" className="ml-[2px] h-6 w-5" />}>
            {t('wechatPage.discover.nearby')}
          </List.Item>
        </List>
        <List className="mt-1.5">
          <List.Item withJump icon={<GamesSVG />}>
            {t('wechatPage.discover.games')}
          </List.Item>
        </List>
        <List className="mt-1.5">
          <List.Item withJump icon={<MiniProgramOutlinedSVG fill="#6B66C3" />}>
            {t('wechatPage.discover.mp')}
          </List.Item>
        </List>
      </div>
      <BottomNavbar />
    </>
  );
};

export default Discover;
