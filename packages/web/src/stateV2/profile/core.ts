import { INIT_FRIENDS, INIT_MY_PROFILE, MYSELF_ID } from "@/faker/wechat/user";
import { type SetStateAction, atom } from "jotai";
import { focusAtom } from "jotai-optics";
import { atomWithStorage } from "jotai/utils";
import type { OpticFor_ } from "optics-ts";
import { useCallback } from "react";
import { mainStore } from "../store";
import { generateNameAnchorGroup } from "./helpers";
import type {
	IStateProfile,
	TStateAllProfiles,
	TStateFriendsTotalCountDisplayConfig,
} from "./typing";

/**
 * 所有人的信息
 */
export const allProfilesAtom = atomWithStorage<TStateAllProfiles>(
	"allProfiles",
	[INIT_MY_PROFILE, ...INIT_FRIENDS],
	undefined,
	{ getOnInit: true },
);

export const getAllProfilesValueSnapshot = () => mainStore.get(allProfilesAtom);
export const setAllProfilesValue = (args: SetStateAction<TStateAllProfiles>) =>
	mainStore.set(allProfilesAtom, args);

/**
 * 所有人的信息 id
 */
export const allProfilesIdsAtom = atom((get) => get(allProfilesAtom).map((v) => v.id));

export const getAllProfilesIdsValueSnapshot = () => mainStore.get(allProfilesIdsAtom);

/**
 * 实际上的好友总数
 */
export const allProfilesTotalCountAtom = atom((get) => get(allProfilesIdsAtom).length);

export const getAllProfilesTotalCountValueSnapshot = () => mainStore.get(allProfilesTotalCountAtom);

/**
 * 单个用户信息
 */
export const profileAtom = (id: IStateProfile["id"]) =>
	focusAtom(
		allProfilesAtom,
		useCallback((optic: OpticFor_<TStateAllProfiles>) => optic.find((v) => v.id === id), []),
	);

export const getProfileValueSnapshot = (id: IStateProfile["id"]) =>
	mainStore.get(allProfilesAtom).find((v) => v.id === id);
export const setProfileValue = (id: IStateProfile["id"], args: SetStateAction<IStateProfile>) =>
	mainStore.set(profileAtom(id), args);

/**
 * 我的个人信息
 */
export const myProfileAtom = focusAtom(allProfilesAtom, (optic) =>
	optic.find((v) => v.id === MYSELF_ID),
);

export const getMyProfileValueSnapshot = () =>
	mainStore.get(allProfilesAtom).find((v) => v.id === MYSELF_ID);

/**
 * 用于通讯录界面的锚点数据
 */
export const allProfilesAnchorDataAtom = atom((get) => {
	console.time("allFriendsAnchorDataState");
	const res = generateNameAnchorGroup(
		get(allProfilesAtom).map((v) => ({
			id: v.id,
			name: v.remark ?? v.nickname,
			description: v.description,
			isStarred: v.isStarred,
			avatarInfo: v.avatarInfo,
		})),
	);
	console.timeEnd("allFriendsAnchorDataState");
	return res;
});

/**
 * 好友总数显示
 */
export const friendsTotalCountDisplayConfigAtom =
	atomWithStorage<TStateFriendsTotalCountDisplayConfig>(
		"friendsTotalCountDisplayConfig",
		{
			calcuateType: "auto",
		},
		undefined,
		{ getOnInit: true },
	);

export const getFriendsTotalCountDisplayConfigValueSnapshot = () =>
	mainStore.get(friendsTotalCountDisplayConfigAtom);

export const setFriendsTotalCountDisplayConfigValue = (
	args: SetStateAction<TStateFriendsTotalCountDisplayConfig>,
) => mainStore.set(friendsTotalCountDisplayConfigAtom, args);

export const friendsTotalCountAtom = atom<number>((get) => {
	const { calcuateType, count } = get(friendsTotalCountDisplayConfigAtom);
	if (calcuateType === "static") {
		return count ?? 0;
	}
	return get(allProfilesTotalCountAtom) - 1;
});

export const getFriendsTotalCountValueSnapshot = () => mainStore.get(friendsTotalCountAtom);