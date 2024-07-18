import { Switch } from "antd";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import useMode from "../useMode";

const ModeSwitch = () => {
	const { t } = useTranslation();
	const { isEdit, setMode } = useMode();

	return (
		<Switch
			checkedChildren={t("base.modeEdit")}
			unCheckedChildren={t("base.modePreview")}
			checked={isEdit}
			onChange={(checked) => {
				setMode(checked ? "edit" : "preview");
			}}
		/>
	);
};

export default memo(ModeSwitch);
