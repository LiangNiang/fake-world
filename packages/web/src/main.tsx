import './preflight.css';
import './index.css';
import 'animate.css';
import './i18n';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import RecoilNexus, { setRecoil } from 'recoil-nexus';

import { ImageDBManager } from './dataSource/DBManagers.ts';
import { routes } from './router/index.tsx';
import { deviceState, MOBILE_LIST } from './state/screenState.ts';
import { initDayjs } from './time.ts';
import { backendHealthCheck } from './utils.ts';

window.setDevice = (v) => {
  setRecoil(deviceState, v as MOBILE_LIST);
};

initDayjs();
ImageDBManager.initDBImagesCacheStore();
ImageDBManager.initDBBridge();
backendHealthCheck();

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <RecoilNexus />
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>
);
