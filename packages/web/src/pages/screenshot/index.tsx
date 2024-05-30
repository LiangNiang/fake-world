import { App, ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";

import LeftForm from "./leftForm";

const ScreenshotApp = () => {
	return (
		<ConfigProvider locale={zhCN}>
			<App>
				<div className="grid h-screen grid-cols-2">
					<div className="col-span-1 flex max-h-screen flex-col border-orange-400 border-r border-dashed p-4">
						<LeftForm className="h-[calc(100vh-2rem)]" />
					</div>
				</div>
			</App>
		</ConfigProvider>
	);
};

export default ScreenshotApp;
