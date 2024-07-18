import atomWithStorage from "./base";
import { mainStore } from "./store";

export const ALL_LOGIN_DEVICES = ["Windows", "iPad", "Mac", "Watch", "Desktop"] as const;

export type TStateMultipleDeviceLogin = {
	devices: (typeof ALL_LOGIN_DEVICES)[number][];
	visible: boolean;
};

export const multipleDeviceLoginAtom = atomWithStorage<TStateMultipleDeviceLogin>(
	"multipleDeviceLogin",
	{
		devices: ["iPad"],
		visible: true,
	},
);

export const getMultipleDeviceLoginValueSnapshot = () => mainStore.get(multipleDeviceLoginAtom);
