import { css, Global } from '@emotion/react';
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
  return (
    <div style={{ width: sizeConfig.width, height: sizeConfig.height }} className="relative flex flex-col overflow-hidden" id="screen">
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

export default Screen;
