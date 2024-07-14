import { ALL_LANGUAGES, getCurrentLanguage } from "@/i18n";
import { activatedNodeAtom, hoveredNodeAtom } from "@/stateV2/detectedNode";
import { getTouredValueSnapshot, tourTargetAtom } from "@/stateV2/tour";
import { LOCALE_MAP } from "@/time";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useKeyPress } from "ahooks";
import { Radio, Space, Tooltip } from "antd";
import dayjs from "dayjs";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ModeSwitch from "../ModeSwitch";
import useMode from "../useMode";
import QuickJumpSelect from "./QuickJumpSelect";

const CommonBlock = () => {
	const { setMode, isPreview } = useMode();
	const setHoveredNode = useSetAtom(hoveredNodeAtom);
	const setActivatedNode = useSetAtom(activatedNodeAtom);
	const { i18n, t } = useTranslation();
	const setTourTarget = useSetAtom(tourTargetAtom);
	const canSet = !getTouredValueSnapshot();

	useEffect(() => {
		if (isPreview) {
			setActivatedNode(null);
			setHoveredNode(null);
		}
	}, [isPreview]);

	useKeyPress(
		"shift.z",
		() => {
			setMode((prev) => (prev === "edit" ? "preview" : "edit"));
		},
		{ exactMatch: true },
	);

	return (
		<div className="mb-2 space-y-2 border-b pb-2">
			<div className="grid grid-cols-2 gap-1">
				<div className="col-span-1">
					<Tooltip title={t("base.quickJumpTooltip")}>
						{t("base.quickJump")} <InfoCircleOutlined className="cursor-pointer" />
					</Tooltip>
				</div>
				<QuickJumpSelect />
			</div>
			<div
				className="grid grid-cols-2 gap-1"
				ref={(element) => {
					canSet &&
						setTourTarget((pv) => ({
							...pv,
							ref1: element,
						}));
				}}
			>
				<div className="col-span-1">
					<Tooltip title={t("base.modeTooltip")}>
						{t("base.mode")} <InfoCircleOutlined className="cursor-pointer" />
					</Tooltip>
				</div>
				<div className="col-span-1">
					<ModeSwitch />
				</div>
			</div>
			<div className="grid grid-cols-2 gap-1">
				<div className="col-span-1">
					<Tooltip title={t("base.langTooltip")}>
						{t("base.lang")} <InfoCircleOutlined className="cursor-pointer" />
					</Tooltip>
				</div>
				<div className="col-span-1">
					<Radio.Group
						value={getCurrentLanguage()}
						onChange={(ev) => {
							i18n.changeLanguage(ev.target.value);
							dayjs.locale(LOCALE_MAP[ev.target.value as keyof typeof LOCALE_MAP]);
						}}
					>
						<Space direction="vertical">
							{ALL_LANGUAGES.map((v) => (
								<Radio key={v.value} value={v.value}>
									{v.label}
								</Radio>
							))}
						</Space>
					</Radio.Group>
				</div>
			</div>
		</div>
	);
};

export default CommonBlock;
