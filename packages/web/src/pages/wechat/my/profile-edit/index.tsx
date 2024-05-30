import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import BackFilledSVG from "@/assets/back-filled.svg?react";
import QRCODE_OUTLINED_SVG from "@/assets/qrcode-outlined.svg?react";
import { h } from "@/components/HashAssets";
import { canBeDetected } from "@/components/NodeDetected";
import useModeNavigate from "@/components/useModeNavigate";
import { MetaDataType } from "@/state/detectedNode";
import { myProfileState } from "@/state/profile";
import List from "@/wechatComponents/List";

const ProfileEdit = () => {
	const myProfile = useRecoilValue(myProfileState);
	const navigate = useModeNavigate();
	const { t } = useTranslation();

	const { avatarInfo, nickname, tickleText, wechat, coin } = myProfile;

	return (
		<canBeDetected.div
			className="flex flex-1 flex-col"
			metaData={{
				treeItemDisplayName: (data) => `个人信息编辑（${data.nickname}）`,
				type: MetaDataType.MyProfile,
			}}
		>
			<div className="grid grid-cols-3 bg-[rgba(237,237,237,1)] px-4 py-2">
				<BackFilledSVG
					fill="black"
					className="h-5 w-5 cursor-pointer"
					onClick={() => navigate("/wechat/my")}
				/>
				<div className="flex items-center justify-center">{t("wechatPage.my.profile.title")}</div>
			</div>
			<div className="flex-1 bg-[rgba(237,237,237,1)]">
				<List>
					<List.Item withJump>
						<div className="flex items-center justify-between">
							<div>{t("wechatPage.my.profile.photo")}</div>
							<h.img useAntdImageComponent src={avatarInfo} className="h-16 w-16 rounded-md" />
						</div>
					</List.Item>
					<List.Item withJump>
						<div className="flex items-center justify-between">
							<div>{t("wechatPage.my.profile.name")}</div>
							<div className="text-black/50">{nickname}</div>
						</div>
					</List.Item>
					<List.Item withJump>
						<div className="flex items-center justify-between">
							<div>{t("wechatPage.my.profile.tickle")}</div>
							<div className="text-black/50">{tickleText}</div>
						</div>
					</List.Item>
					<List.Item withJump>
						<div className="flex items-center justify-between">
							<div>{t("wechatPage.my.profile.wid")}</div>
							<div className="text-black/50">{wechat}</div>
						</div>
					</List.Item>
					<List.Item withJump>
						<div className="flex items-center justify-between">
							<div>{t("wechatPage.my.profile.qr")}</div>
							<QRCODE_OUTLINED_SVG fill="rgba(0,0,0,0.6)" className="h-5 w-5" />
						</div>
					</List.Item>
					<List.Item withJump>{t("wechatPage.my.profile.more")}</List.Item>
				</List>
				<List className="mt-1.5">
					<List.Item withJump>{t("wechatPage.my.profile.icr")}</List.Item>
				</List>
				<List className="mt-1.5">
					<List.Item withJump>
						<div className="flex items-center justify-between">
							<div>{t("wechatPage.my.profile.weBeans")}</div>
							<div className="text-black/50">{coin ? `${coin} 个` : ""}</div>
						</div>
					</List.Item>
				</List>
				<List className="mt-1.5">
					<List.Item withJump>{t("wechatPage.my.profile.address")}</List.Item>
				</List>
			</div>
		</canBeDetected.div>
	);
};

export default ProfileEdit;
