import './preflight.css';
import './index.css';
import 'animate.css';
import './i18n';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';

import { initDBBridge, initDBImagesCacheStore } from './dataSource/db.ts';
import { routes } from './router/index.tsx';
import { initDayjs } from './time.ts';
import { backendHealthCheck } from './utils.ts';

initDayjs();
initDBImagesCacheStore();
initDBBridge();
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
