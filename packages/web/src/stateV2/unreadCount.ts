import { atomEffect } from "jotai-effect";
import atomWithStorage from "./base";
import { bottomNavbarsAtom } from "./bottomNavbars";
import { mainStore } from "./store";

export type TStateUnreadCount = {
	count: number;
	calcuateType: "static" | "auto";
};

export const unreadCountAtom = atomWithStorage<TStateUnreadCount>("unreadCount", {
	count: 13,
	calcuateType: "auto",
});

export const getUnreadCountValueSnapshot = () => mainStore.get(unreadCountAtom);

export const unreadCountEffect = atomEffect((get, set) => {
	const { count } = get(unreadCountAtom);
	set(bottomNavbarsAtom, (pv) => ({
		...pv,
		WECHAT: {
			...pv.WECHAT,
			badgeNumber: count,
		},
	}));
});
