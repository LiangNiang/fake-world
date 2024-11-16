import { HASH_ASSETS_DB_NAME, hashAssetsDB } from "@/db";
import { touredAtom } from "@/stateV2/tour";
import { InfoCircleOutlined, OpenAIOutlined } from "@ant-design/icons";
import { App, Button, Dropdown, Tooltip } from "antd";
import Dexie from "dexie";
import { useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import useAppInfo from "../useAppInfo";
import GeneratePresetData from "./GeneratePresetData";
import GenerateRandomUser from "./GenerateRandomUser";
import ScreenDevicesSelect from "./ScreenDevicesSelect";
import ScreenshotButton from "./ScreenshotButton";

const MainMenu = () => {
	const { label, app } = useAppInfo();
	const { t } = useTranslation();
	const setToured = useSetAtom(touredAtom);
	const { modal } = App.useApp();

	return (
		<>
			<div className="space-y-2">
				<div className="grid grid-cols-2 gap-1">
					<div className="col-span-1">{t("base.curApp")}</div>
					<div>{app?.name}</div>
				</div>
				<div className="grid grid-cols-2 gap-1">
					<div className="col-span-1">{t("base.curPage")}</div>
					<div>{label}</div>
				</div>
				<div className="grid grid-cols-2 items-center gap-1">
					<div className="col-span-1">{t("base.csd")}</div>
					<ScreenDevicesSelect />
				</div>
				<div className="grid grid-cols-2 gap-1">
					<Tooltip title={t("menu.mainBlock.screenshotTooltip")} placement="topLeft">
						<div className="col-span-1">
							{t("menu.mainBlock.screenshot")} <InfoCircleOutlined />
						</div>
					</Tooltip>
					<ScreenshotButton />
				</div>

				<div className="grid grid-cols-2 gap-1">
					<div className="col-span-1">{t("menu.mainBlock.friends")}</div>
					<GenerateRandomUser />
				</div>

				<div className="grid grid-cols-2 gap-1">
					<div className="col-span-1 font-semibold text-orange-500 text-xl">
						<OpenAIOutlined />
						{t("menu.mainBlock.generatePresetData")}
						<OpenAIOutlined />
					</div>
					<GeneratePresetData />
				</div>

				<div className="grid grid-cols-2 items-center gap-1">
					<div className="col-span-1">{t("menu.mainBlock.clearData")}</div>
					<Dropdown.Button
						danger
						onClick={() => {
							modal.confirm({
								title: t("menu.mainBlock.clearAllConfirmTitle"),
								content: t("menu.mainBlock.clearAllDesc"),
								onOk: async () => {
									localStorage.clear();
									await Dexie.delete(HASH_ASSETS_DB_NAME);
									window.location.reload();
								},
							});
						}}
						menu={{
							items: [
								{
									key: "1",
									label: t("menu.mainBlock.clearImg"),
								},
							],
							onClick: async ({ key }) => {
								if (key === "1") {
									await hashAssetsDB.images.clear();
									window.location.reload();
								}
							},
						}}
					>
						{t("menu.mainBlock.clearAll")}
					</Dropdown.Button>
				</div>

				<div>
					<Button
						onClick={() => {
							setToured(false);
						}}
					>
						开启使用指引
					</Button>
				</div>
			</div>
		</>
	);
};

export default MainMenu;
