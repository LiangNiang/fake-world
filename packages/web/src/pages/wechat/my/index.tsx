import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import ADD_OUTLINED_SVG from "@/assets/add-outlined.svg?react";
import ALBUM_OUTLINED_SVG from "@/assets/album-outlined.svg?react";
import ARROW_OUTLINED_SVG from "@/assets/arrow-outlined.svg?react";
import CARDS_SVG from "@/assets/cards.svg?react";
import FAVORITES_SVG from "@/assets/favorites.svg?react";
import PAYLOGO_OUTLINED_SVG from "@/assets/paylogo-outlined.svg?react";
import QRCODE_OUTLINED_SVG from "@/assets/qrcode-outlined.svg?react";
import Setting_Outlined_SVG from "@/assets/setting-outlined.svg?react";
import StickerOutlinedSVG from "@/assets/sticker-outlined.svg?react";
import { h } from "@/components/HashAssets";
import { canBeDetected } from "@/components/NodeDetected";
import useModeNavigate from "@/components/useModeNavigate";
import { BottomNavBars } from "@/state/btmNavbarsState";
import { MetaDataType } from "@/state/detectedNode";
import { myProfileState } from "@/state/profile";
import BottomNavbar, { useToggleNavbarActivated } from "@/wechatComponents/BottomNavbar";
import List from "@/wechatComponents/List";

import CircularNotchSVG from "./assets/circular-notch.svg?react";

const My = () => {
	const { avatarInfo, wechat, nickname } = useRecoilValue(myProfileState);
	const navigate = useModeNavigate();
	const { t } = useTranslation();
	useToggleNavbarActivated(BottomNavBars.MY);

	return (
		<>
			<canBeDetected.div
				className="flex cursor-pointer flex-col pt-12 pr-3 pb-6 pl-9"
				onClick={() => {
					navigate("/wechat/my/profile-edit");
				}}
				metaData={{
					type: MetaDataType.MyProfile,
					treeItemDisplayName: (data) => `个人信息编辑（${data.nickname}）`,
				}}
			>
				<div className="flex">
					<h.img src={avatarInfo} className="h-16 w-16 rounded-md" />
					<div className="ml-4 flex flex-col justify-between py-1">
						<div className="font-medium text-lg">{nickname}</div>
						<div className="space-x-3 text-black/60 text-sm">
							<span>{t("wechatPage.my.wid")}:</span>
							<span>{wechat}</span>
						</div>
					</div>
					<div className="ml-auto flex items-end space-x-3 py-1">
						<QRCODE_OUTLINED_SVG fill="rgba(0,0,0,0.6)" className="w-[18px]" />
						<ARROW_OUTLINED_SVG fill="rgba(0,0,0,0.3)" className="w-[18px]" />
					</div>
				</div>
				<div className="mt-[2px] ml-20 flex items-center">
					<div className="flex origin-left scale-[0.85] items-center space-x-[2px] rounded-2xl border border-black/10 px-3">
						<ADD_OUTLINED_SVG fill="rgba(0,0,0,0.6)" className="w-3" />
						<span className="text-black/60 text-sm">{t("wechatPage.my.status")}</span>
					</div>
					<div className="flex h-5 w-5 items-center justify-center rounded-full border border-black/10">
						<CircularNotchSVG className="h-3 w-3" fill="#707070" />
					</div>
				</div>
			</canBeDetected.div>
			<div className="flex-1 bg-[rgba(237,237,237,1)]">
				<List className="mt-1.5">
					<List.Item
						withJump
						icon={<PAYLOGO_OUTLINED_SVG fill="#39CD80" />}
						onClick={() => navigate("/wechat/service")}
					>
						{t("wechatPage.my.services")}
					</List.Item>
				</List>
				<List className="mt-1.5">
					<List.Item withJump icon={<FAVORITES_SVG />}>
						{t("wechatPage.my.favorites")}
					</List.Item>
					<List.Item withJump icon={<ALBUM_OUTLINED_SVG fill="#2A7FCB" />}>
						{t("wechatPage.my.moments")}
					</List.Item>
					<List.Item withJump icon={<CARDS_SVG />}>
						{t("wechatPage.my.cards")}
					</List.Item>
					<List.Item withJump icon={<StickerOutlinedSVG fill="#F3C429" />}>
						{t("wechatPage.my.stickers")}
					</List.Item>
				</List>
				<List className="mt-1.5">
					<List.Item withJump icon={<Setting_Outlined_SVG fill="#2A7FCB" />}>
						{t("wechatPage.my.settings")}
					</List.Item>
				</List>
			</div>
			<BottomNavbar />
		</>
	);
};

export default My;
