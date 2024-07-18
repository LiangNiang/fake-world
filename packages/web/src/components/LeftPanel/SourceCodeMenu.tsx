import ReactJson from "@microlink/react-json-view";
import { useTranslation } from "react-i18next";
import { exportLocalStorage } from "./utils";
import "./style.scss";
import { STORAEG_UPDATE_KEY, storageEventEmitter } from "@/stateV2/base";
import { useEffect, useState } from "react";

const SourceCodeMenu = () => {
	const { t } = useTranslation();
	const [src, setSrc] = useState(() => exportLocalStorage());

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
			<div className="mb-4 font-bold">{t("menu.code")}</div>
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
