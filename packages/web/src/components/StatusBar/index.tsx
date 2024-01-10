import { ClockCircleOutlined } from '@ant-design/icons';
import { useUpdate } from 'ahooks';
import { Tooltip } from 'antd';
import cn from 'classnames';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRecoilState, useRecoilValue } from 'recoil';

import { MetaDataType } from '@/state/detectedNode';
import { statusBarHideState, statusBarMountNodeState, statusBarState } from '@/state/statusBarState';

import { canBeDetected } from '../NodeDetected';
import BatterySVG from './assets/battery.svg?react';
import SingalSVG from './assets/singal.svg?react';
import WifiSVG from './assets/wifi.svg?react';

const StatusBar = () => {
  const mountNode = useRecoilValue(statusBarMountNodeState);
  const [{ backgroundColor, theme }, setStatusBar] = useRecoilState(statusBarState);
  const hidden = useRecoilValue(statusBarHideState);
  const update = useUpdate();
  const divRef = useRef<HTMLDivElement>(null);

  const fromSiblingNodeSetColor = (sibling: Element) => {
    if (mountNode !== null || !sibling) return;
    if (sibling.nextSibling === null && document.querySelector('#screen')!.childElementCount === 2) {
      fromSiblingNodeSetColor(sibling.childNodes[0] as Element);
    } else {
      const color = getComputedStyle(sibling).backgroundColor;
      setStatusBar((pv) => ({
        ...pv,
        backgroundColor: color,
      }));
    }
  };

  const mutationCallback = (mutations: MutationRecord[]) => {
    const myId = divRef.current?.id;
    if (!myId && mountNode !== null) return;
    let nextSibling;
    for (const mr of mutations) {
      if (mr.type === 'childList') {
        if (mr.addedNodes.length === 0) continue;
        for (const node of mr.addedNodes) {
          const previousSibling = node.previousSibling;
          if (previousSibling instanceof Element && previousSibling.id === myId) {
            nextSibling = node as Element;
            break;
          }
        }
      }
    }

    if (nextSibling) {
      fromSiblingNodeSetColor(nextSibling);
    }
  };

  useEffect(() => {
    const screen = document.querySelector('#screen');
    const observer = new MutationObserver(mutationCallback);
    observer.observe(screen!, {
      attributes: false,
      childList: true,
    });

    const nextSibling = divRef.current?.nextSibling;
    if (nextSibling && nextSibling instanceof Element) {
      fromSiblingNodeSetColor(nextSibling);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const renderContent = (isMount?: boolean) => {
    const useWhiteColorText = theme === 'dark';
    return (
      <canBeDetected.div
        innerRef={divRef}
        className={cn('flex items-center justify-between py-2 pl-10 pr-6', { hidden: hidden, 'pointer-events-auto z-10': isMount })}
        metaData={{
          type: MetaDataType.StatusBar,
          treeItemDisplayName: '状态栏',
          operations: [
            {
              onClick: update,
              element: (
                <Tooltip title="同步当前时间">
                  <ClockCircleOutlined />
                </Tooltip>
              ),
            },
          ],
        }}
        style={{
          backgroundColor,
        }}
      >
        <div className={cn('font-semibold', { 'text-white': useWhiteColorText })}>{dayjs().format('HH:mm')}</div>
        <div className="flex items-center space-x-2">
          <SingalSVG fill={useWhiteColorText ? 'white' : 'black'} />
          <WifiSVG fill={useWhiteColorText ? 'white' : 'black'} />
          {/* 这里svg每个path使用了currentcolor，不能设置为 fill 会导致样式异常 */}
          <BatterySVG className={cn({ 'text-white': useWhiteColorText, 'text-black': !useWhiteColorText })} />
        </div>
      </canBeDetected.div>
    );
  };

  if (mountNode) {
    return createPortal(renderContent(true), mountNode);
  }

  return renderContent();
};

export default StatusBar;
