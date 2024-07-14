import { useTimeout } from "ahooks";
import { Popover, type PopoverProps } from "antd";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";

import ModeSwitch from "../ModeSwitch";

const TopPopover = ({ children }: PopoverProps) => {
	const inShareMode = !!window.__SHARE_KEY__;
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	useTimeout(() => {
		setOpen(true);
	}, 500);

	return (
		<Popover
			rootClassName="max-lg:hidden"
			open={!inShareMode && open}
			content={
				<div className="flex space-x-2">
					<span>{t("base.switchMode")}</span>
					<ModeSwitch />
				</div>
			}
			autoAdjustOverflow={false}
			placement="topLeft"
			zIndex={1}
		>
			{children}
		</Popover>
	);
};

export default memo(TopPopover);
