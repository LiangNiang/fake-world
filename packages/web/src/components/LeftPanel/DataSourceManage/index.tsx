import { Button, Tooltip } from "antd";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { ENV_VERSION_KEY } from "@/consts";
import { DATA_SOURCE_TYPE_LABEL, currentDataSourceState } from "@/state/globalConfig";

import DataSourceManagerDrawer from "./DataSourceManagerDrawer";

const DataSourceManage = () => {
	const [open, setOpen] = useState(false);
	const { id, name, type } = useRecoilValue(currentDataSourceState);
	const { t } = useTranslation();

	return (
		<>
			<div className="col-span-1 flex flex-col space-y-1">
				<Tooltip title={id} placement="topLeft">
					<span className="overflow-hidden text-ellipsis whitespace-nowrap">ID：{id}</span>
				</Tooltip>
				{type === "local" && (
					<div>
						{t("menu.dataSourceManage.name")}：
						{id === ENV_VERSION_KEY ? t("menu.dataSourceManage.defaultData") : name}
					</div>
				)}
				<div>
					{t("menu.dataSourceManage.type")}：{t(DATA_SOURCE_TYPE_LABEL[type])}
				</div>
				<Button
					onClick={() => {
						setOpen(true);
					}}
					className="overflow-auto"
				>
					{t("menu.dataSourceManage.manage")}
				</Button>
			</div>
			<DataSourceManagerDrawer open={open} setOpen={setOpen} />
		</>
	);
};

export default memo(DataSourceManage);
