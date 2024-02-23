import { css, Global } from '@emotion/react';
import { CSSProperties, memo } from 'react';
import { isDesktop, isMobileOnly } from 'react-device-detect';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet } from 'react-router-dom';

import Fallback from '../Fallback';
import DetectedOverall from '../NodeDetected/DetectedFloating';
import StatusBar from '../StatusBar';
import useDeviceConfig from '../useDeviceConfig';

const Screen = () => {
  const { screenSize } = useDeviceConfig();

  const style: CSSProperties = isMobileOnly
    ? { width: '100vw', height: 'calc(100vh - 1px)' }
    : {
        width: screenSize.width,
        height: screenSize.height,
      };

  return (
    <div style={style} className="relative flex flex-col overflow-hidden" id="screen">
      <Global
        styles={css`
          &::-webkit-scrollbar {
            display: none;
          }
        `}
      />
      <DetectedOverall />
      {isDesktop && <StatusBar />}
      <ErrorBoundary FallbackComponent={Fallback}>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
};

export default memo(Screen);
