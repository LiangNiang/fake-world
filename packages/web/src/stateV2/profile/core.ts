import { INIT_FRIENDS, INIT_MY_PROFILE, MYSELF_ID } from "@/faker/wechat/user";
import { dequal } from "dequal/lite";
import { type SetStateAction, atom } from "jotai";
import { focusAtom } from "jotai-optics";
import { atomFamily, atomWithStorage, selectAtom } from "jotai/utils";
import type { OpticFor_ } from "optics-ts";
import { mainStore } from "../store";
import { debounceGenerateNameAnchorGroup, type generateNameAnchorGroup } from "./helpers";
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

const allProfilesDEqualCompareAtom = selectAtom(allProfilesAtom, (v) => v, dequal);

export const getAllProfilesValueSnapshot = () => mainStore.get(allProfilesAtom);
export const setAllProfilesValue = (args: SetStateAction<TStateAllProfiles>) =>
	mainStore.set(allProfilesAtom, args);

/**
 * 所有人的信息 id
 */
export const allProfilesIdsAtom = atom((get) => get(allProfilesDEqualCompareAtom).map((v) => v.id));

export const getAllProfilesIdsValueSnapshot = () => mainStore.get(allProfilesIdsAtom);

/**
 * 信息总数
 */
export const allProfilesTotalCountAtom = atom((get) => get(allProfilesDEqualCompareAtom).length);

export const getAllProfilesTotalCountValueSnapshot = () => mainStore.get(allProfilesTotalCountAtom);

/**
 * 单个用户信息
 */
export const profileAtom = atomFamily(
	(id: IStateProfile["id"]) =>
		focusAtom(allProfilesAtom, (optic: OpticFor_<TStateAllProfiles>) =>
			optic.find((v) => v.id === id),
		),
	dequal,
);

export const getProfileValueSnapshot = (id: IStateProfile["id"]) => mainStore.get(profileAtom(id));
export const setProfileValue = (id: IStateProfile["id"], args: SetStateAction<IStateProfile>) =>
	mainStore.set(profileAtom(id), args);

/**
 * 我的个人信息
 */
export const myProfileAtom = focusAtom(allProfilesAtom, (optic) =>
	optic.find((v) => v.id === MYSELF_ID),
);

export const getMyProfileValueSnapshot = () => mainStore.get(myProfileAtom);

/**
 * 用于通讯录界面的锚点数据
 */
export const allProfilesAnchorDataAtom = atom<Promise<ReturnType<typeof generateNameAnchorGroup>>>(
	(get) => {
		const payload = get(allProfilesDEqualCompareAtom).map((v) => ({
			id: v.id,
			name: v.remark ?? v.nickname,
			description: v.description,
			isStarred: v.isStarred,
			avatarInfo: v.avatarInfo,
		}));
		return new Promise((resolve) => {
			debounceGenerateNameAnchorGroup(payload, resolve);
		});
	},
);

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
