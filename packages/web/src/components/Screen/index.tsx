import { css, Global } from '@emotion/react';
import { CSSProperties, memo } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet } from 'react-router-dom';

import Fallback from '../Fallback';
import DetectedOverall from '../NodeDetected/DetectedFloating';
import StatusBar from '../StatusBar';

type Props = {
  sizeConfig: {
    width: string;
    height: string;
  };
};

const Screen = ({ sizeConfig }: Props) => {
  const style: CSSProperties = isMobileOnly
    ? { width: '100vw', height: '100vh' }
    : {
        width: sizeConfig.width,
        height: sizeConfig.height,
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
      <StatusBar />
      <ErrorBoundary FallbackComponent={Fallback}>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
};

export default memo(Screen);
