import btmNavbarsState from "@/state/btmNavbarsState";
import { atomEffect } from "jotai-effect";
import { atomWithStorage } from "jotai/utils";
import { setRecoil } from "recoil-nexus";
import { mainStore } from "./store";

export type TStateUnreadCount = {
	count: number;
	calcuateType: "static" | "auto";
};

export const unreadCountAtom = atomWithStorage<TStateUnreadCount>("unreadCount", {
	count: 13,
	calcuateType: "auto",
});

export const getUnreadCountSnapshot = () => mainStore.get(unreadCountAtom);

export const unreadCountEffect = atomEffect((get, set) => {
	const { count } = get(unreadCountAtom);
	setRecoil(btmNavbarsState, (pv) => ({
		...pv,
		WECHAT: {
			...pv.WECHAT,
			badgeNumber: count,
		},
	}));
});
