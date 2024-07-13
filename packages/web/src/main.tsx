import "./preflight.css";
import "./index.css";
import "animate.css";
import "./i18n";

import { Provider } from "jotai";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import { ImageDBManager } from "./dataSource/DBManagers.ts";
import { routes } from "./router/index.tsx";
import { mainStore } from "./stateV2/store.ts";
import { initDayjs } from "./time.ts";
import { backendHealthCheck } from "./utils.ts";

initDayjs();
ImageDBManager.initDBImagesCacheStore();
backendHealthCheck();

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Provider store={mainStore}>
			<RecoilRoot>
				<RecoilNexus />
				<RouterProvider router={router} />
			</RecoilRoot>
		</Provider>
	</React.StrictMode>,
);
