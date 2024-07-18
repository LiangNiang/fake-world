import type { TFunction } from "i18next";
import type { IStateProfile } from "./typing";

export const PRIVACY_TEXT_MAP: Record<
	IStateProfile["privacy"],
	string | ((gender: NonNullable<IStateProfile["gender"]>, t: TFunction) => string)
> = {
	all: "",
	chatsOnly: "wechatPage.friend.privacyChatsOnly",
	hideMyPosts: (gender, t) =>
		t("wechatPage.friend.privacyHideMy", {
			title: gender === "female" ? t("base.she") : t("base.he"),
		}),
	hideFriendPosts: (gender, t) =>
		t("wechatPage.friend.privacyHideFriend", {
			title: gender === "female" ? t("base.her") : t("base.his"),
		}),
};

export const MOMENTS_PRIVACY_TEXT_MAP: Record<IStateProfile["momentsPrivacy"], string> = {
	all: "全部",
	lastSixMonths: "最近半年",
	lastOneMonth: "最近一个月",
	lastThreeDays: "最近三天",
};
