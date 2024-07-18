import ReactJson from "@microlink/react-json-view";
import { useTranslation } from "react-i18next";
import { exportLocalStorage } from "./utils";
import "./style.scss";
import { STORAEG_UPDATE_KEY, storageEventEmitter } from "@/stateV2/atomWithStorage";
import { CopyOutlined } from "@ant-design/icons";
import { App, Button } from "antd";
import copy from "copy-to-clipboard";
import { useEffect, useState } from "react";

const SourceCodeMenu = () => {
	const { t } = useTranslation();
	const [src, setSrc] = useState(() => exportLocalStorage());
	const { message } = App.useApp();

	useEffect(() => {
		const listener = () => {
			setSrc({ ...exportLocalStorage() });
		};
		storageEventEmitter.addEventListener(STORAEG_UPDATE_KEY, listener);

		return () => {
			storageEventEmitter.removeEventListener(STORAEG_UPDATE_KEY, listener);
		};
	}, []);

	return (
		<div>
			<div className="mb-4 flex items-center space-x-4">
				<div className="font-bold">{t("menu.code")}</div>
				<Button
					icon={<CopyOutlined />}
					onClick={() => {
						copy(JSON.stringify(src));
						message.success(t("base.copySuccess"));
					}}
				/>
			</div>
			<ReactJson
				src={src}
				name={null}
				groupArraysAfterLength={50}
				enableClipboard={false}
				displayDataTypes={false}
			/>
		</div>
	);
};

export default SourceCodeMenu;
