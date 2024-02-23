/* eslint-disable complexity */
import { css, Global } from '@emotion/react';
import { useScroll } from 'ahooks';
import { pick } from 'lodash-es';
import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { isDesktop } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { getRecoil, setRecoil } from 'recoil-nexus';
import { twJoin } from 'tailwind-merge';

import BackFilledSVG from '@/assets/back-filled.svg?react';
import CameraFilledSVG from '@/assets/camera-filled.svg?react';
import CameraOutlinedSVG from '@/assets/camera-outlined.svg?react';
import { h } from '@/components/HashAssets';
import { canBeDetected } from '@/components/NodeDetected';
import { useMemoScrollPos } from '@/components/useMemoScrollPos';
import useModeNavigate from '@/components/useModeNavigate';
import { IStatusBar, statusBarHideState, statusBarMountNodeState, statusBarState } from '@/state/statusBarState';

import CoverOperations from './CoverOperations';
import { usePartMetaData, useProfile } from './hook';
import TopAvatar from './TopAvatar';

const SCROLL_HEIGHT_THRESHOLD = {
  /** 开始逐渐消失 */
  BEGIN_FADE_AWAY: 180,
  /** 完全消失 */
  COMPLETELY_DISAPPEARED: 220,
  /** 完全变为不透明 */
  COMPLETELY_OPAQUE: 280,
};

const setStatusBarWhenNeeded = (newValue: Partial<IStatusBar>) => {
  const statusBarPartData = pick(getRecoil(statusBarState), Object.keys(newValue));
  if (JSON.stringify(statusBarPartData) !== JSON.stringify(newValue)) {
    setRecoil(statusBarState, (prev) => ({
      ...prev,
      ...newValue,
    }));
  }
};

const DATA_WHEEL_ID = 'wechatMomentsLayout';

const MomentsLayout = () => {
  const portalRef = useRef<HTMLDivElement>(null);
  const divWrapperRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<HTMLDivElement>(null);
  const [navbarStyle, setNavbarStyle] = useState<CSSProperties>({
    backgroundColor: 'rgba(237,237,237,0)',
    opacity: 1,
  });
  const [bgExpand, setBgExpand] = useState(false);
  const navigate = useModeNavigate();
  const hidden = useRecoilValue(statusBarHideState);
  const { momentsBackgroundInfo } = useProfile();
  const setStatusBarMountNode = useSetRecoilState(statusBarMountNodeState);
  const scroll = useScroll(divWrapperRef);
  const { getScrollDataAndSave } = useMemoScrollPos(DATA_WHEEL_ID, divWrapperRef);
  const { t } = useTranslation();

  const barUseBlack = scroll && scroll.top >= SCROLL_HEIGHT_THRESHOLD.COMPLETELY_DISAPPEARED;
  const metaDataPart = usePartMetaData();

  useEffect(() => {
    if (portalRef.current) {
      setStatusBarMountNode(portalRef.current);
    }
    return () => {
      setStatusBarMountNode(null);
      setStatusBarWhenNeeded({ theme: 'light' });
    };
  }, []);

  useEffect(() => {
    getScrollDataAndSave(scroll);
    if (scroll) {
      const { top } = scroll;
      if (bgExpand) {
        setBgExpand(false);
      }
      if (top < SCROLL_HEIGHT_THRESHOLD.BEGIN_FADE_AWAY) {
        setNavbarStyle({
          opacity: 1,
        });
        setStatusBarWhenNeeded({
          backgroundColor: 'transparent',
          theme: 'dark',
        });
        return;
      }
      if (top >= SCROLL_HEIGHT_THRESHOLD.BEGIN_FADE_AWAY && top < SCROLL_HEIGHT_THRESHOLD.COMPLETELY_DISAPPEARED) {
        const opacity =
          (SCROLL_HEIGHT_THRESHOLD.COMPLETELY_DISAPPEARED - top) /
          (SCROLL_HEIGHT_THRESHOLD.COMPLETELY_DISAPPEARED - SCROLL_HEIGHT_THRESHOLD.BEGIN_FADE_AWAY);
        setNavbarStyle({
          opacity,
        });
        setStatusBarWhenNeeded({
          backgroundColor: 'transparent',
          theme: 'dark',
        });
        return;
      }
      if (top >= SCROLL_HEIGHT_THRESHOLD.COMPLETELY_DISAPPEARED && top < SCROLL_HEIGHT_THRESHOLD.COMPLETELY_OPAQUE) {
        const opacity =
          1 -
          (SCROLL_HEIGHT_THRESHOLD.COMPLETELY_OPAQUE - top) /
            (SCROLL_HEIGHT_THRESHOLD.COMPLETELY_OPAQUE - SCROLL_HEIGHT_THRESHOLD.COMPLETELY_DISAPPEARED);
        setNavbarStyle({
          opacity,
          backgroundColor: `rgba(237,237,237,${opacity})`,
          color: 'black',
        });
        setStatusBarWhenNeeded({
          backgroundColor: `rgba(237,237,237,${opacity})`,
          theme: 'light',
        });
        return;
      }
      if (top >= SCROLL_HEIGHT_THRESHOLD.COMPLETELY_OPAQUE) {
        setNavbarStyle({
          opacity: 1,
          backgroundColor: 'rgba(237,237,237,1)',
          color: 'black',
        });
        setStatusBarWhenNeeded({
          backgroundColor: `rgba(237,237,237,1)`,
          theme: 'light',
        });
        return;
      }
    }
  }, [scroll]);

  const momentsBackgroundElement = useMemo(() => {
    return <h.img src={momentsBackgroundInfo} className="h-full w-full object-cover object-center" />;
  }, [momentsBackgroundInfo]);

  return (
    <>
      <Global
        styles={css`
          .fade {
            &-enter {
              opacity: 0;
            }
            &-enter-active {
              opacity: 1;
            }
            &-exit {
              opacity: 1;
            }
            &-exit-active {
              opacity: 0;
            }
            &-enter-active,
            &-exit-active {
              transition: opacity 300ms;
            }
          }
        `}
      />
      <div className="pointer-events-none absolute z-20 w-full bg-transparent" ref={portalRef}></div>
      <div
        className={twJoin(
          'absolute z-20 grid w-full grid-cols-3 px-4 py-2 text-white',
          !hidden && isDesktop && 'mt-10',
          bgExpand && 'transition-all duration-300'
        )}
        style={{
          ...navbarStyle,
          opacity: bgExpand ? 0 : navbarStyle.opacity,
        }}
      >
        <BackFilledSVG fill="currentColor" className="h-5 w-5 cursor-pointer" onClick={() => navigate(-1)} />
        <div className="text-center font-medium">{barUseBlack && t('wechatPage.moments.title')}</div>
        <div className="flex justify-end">
          {barUseBlack ? <CameraOutlinedSVG fill="currentColor" className="h-5 w-5" /> : <CameraFilledSVG fill="currentColor" className="h-5 w-5" />}
        </div>
      </div>

      <div
        className={twJoin('flex-1', bgExpand ? 'overflow-hidden' : 'overflow-auto')}
        ref={divWrapperRef}
        onWheelCapture={() => {
          if (bgExpand) {
            setBgExpand(false);
          }
        }}
        data-wheel-id={DATA_WHEEL_ID}
      >
        <canBeDetected.div
          className={twJoin('cursor-pointer transition-all duration-300', bgExpand ? 'h-5/6' : 'h-72')}
          metaData={{
            treeItemDisplayName: '朋友圈背景图',
            ...metaDataPart,
          }}
          onClick={() => {
            setBgExpand((v) => !v);
          }}
        >
          {momentsBackgroundElement}
        </canBeDetected.div>
        <div className="relative flex flex-col">
          <SwitchTransition>
            <CSSTransition
              nodeRef={animationRef}
              key={bgExpand ? 'ChangeCover' : 'TopAvatar'}
              classNames="fade"
              addEndListener={(done) => {
                animationRef.current?.addEventListener('transitionend', done, false);
              }}
            >
              <div ref={animationRef}>{bgExpand ? <CoverOperations /> : <TopAvatar />}</div>
            </CSSTransition>
          </SwitchTransition>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default MomentsLayout;
