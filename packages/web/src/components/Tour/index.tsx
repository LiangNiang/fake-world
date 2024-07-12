import { EMenus, menuState } from "@/state/globalConfig";
import { modeAtom } from "@/stateV2/mode";
import { tourTargetAtom, touredAtom } from "@/stateV2/tour";
import { sleep } from "@/utils";
import { useInViewport } from "ahooks";
import { Tour as AntdTour } from "antd";
import { useAtom, useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";

const Tour = () => {
	const [toured, setToured] = useAtom(touredAtom);
	const [{ ref1, ref2 }, setTourTarget] = useAtom(tourTargetAtom);
	const [current, setCurrent] = useState(0);
	const setMenu = useSetRecoilState(menuState);
	const setMode = useSetAtom(modeAtom);
	const { t } = useTranslation();
	const [inViewport] = useInViewport(document.getElementById("left-panel") as HTMLElement);

	if (!inViewport) return null;

	return (
		<AntdTour
			current={current}
			open={!toured}
			onClose={() => {
				setMode("preview");
				setToured(true);
				setCurrent(0);
				setTourTarget(RESET);
			}}
			onFinish={() => {
				setMenu(EMenus.Main);
				setTourTarget(RESET);
			}}
			steps={[
				{
					title: "进入编辑模式",
					description: t("menu.tourTip1"),
					target: ref1,
					nextButtonProps: {
						onClick: async () => {
							setMode("edit");
							setMenu(EMenus.Trees);
							await sleep(10);
							setCurrent(1);
						},
					},
				},
				{
					title: "点击第二个菜单，查看可编辑节点",
					description: (
						<>
							<p>{t("menu.tourTip2")}</p>
							<p>{t("menu.tourTip3")}</p>
						</>
					),
					target: ref2,
					prevButtonProps: {
						onClick: async () => {
							setMode("preview");
							await sleep(10);
							setCurrent(0);
						},
					},
				},
			]}
		/>
	);
};

export default memo(Tour);
