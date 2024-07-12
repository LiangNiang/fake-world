import PlusCircleSVG from "@/assets/plus-circle.svg?react";
import SearchOutlinedSVG from "@/assets/search-outlined.svg?react";
import { canBeDetected } from "@/components/NodeDetected";
import {} from "@/components/StatusBar";
import { BottomNavBars } from "@/state/btmNavbarsState";
import { MetaDataType } from "@/state/detectedNode";
import { unreadCountAtom, unreadCountEffect } from "@/stateV2/unreadCount";
import BottomNavbar, { useToggleNavbarActivated } from "@/wechatComponents/BottomNavbar";
import { useAtom, useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import DialogueList from "./DialogueList";
import MultipleDeviceLogin from "./MultipleDeviceLogin";
import StateEffect from "./StateEffect";

const WechatIndex = () => {
	const { count } = useAtomValue(unreadCountAtom);
	const { t } = useTranslation();
	useToggleNavbarActivated(BottomNavBars.WECHAT);
	useAtom(unreadCountEffect);

	return (
		<>
			<StateEffect />
			<div className="grid grid-cols-3 bg-[rgba(237,237,237,1)] px-4 py-2">
				<div className="flex items-center space-x-1 font-bold text-xs" />
				<canBeDetected.span
					className="flex items-center justify-center font-medium"
					metaData={{
						type: MetaDataType.UnreadCount,
						treeItemDisplayName: (d) => `顶栏 ${d.count} 个未读消息`,
					}}
				>
					{count > 0
						? t("wechatPage.main.title", {
								totalUnreadCount: count,
							})
						: t("wechatPage.main.title2")}
				</canBeDetected.span>
				<div className="flex items-center justify-end">
					<PlusCircleSVG width={16} fill="black" className="cursor-pointer" />
				</div>
			</div>
			<div className="flex flex-1 flex-col overflow-y-auto bg-white">
				<div className="flex bg-[rgba(237,237,237,1)] px-2 pb-2">
					<div className="flex flex-1 items-center justify-center rounded-[4px] bg-white p-2 text-xs">
						<SearchOutlinedSVG fill="rgba(0, 0, 0, 0.5)" width={17} height={16} />
						<span className="ml-2 opacity-50">{t("wechatPage.main.search")}</span>
					</div>
				</div>
				<MultipleDeviceLogin />
				<DialogueList />
			</div>
			<BottomNavbar />
		</>
	);
};

export default WechatIndex;
