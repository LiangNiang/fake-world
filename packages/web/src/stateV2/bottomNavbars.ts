import { atomWithStorage } from "jotai/utils";
import { mainStore } from "./store";

export enum EBottomNavBars {
	WECHAT = "WECHAT",
	ADDRESS_BOOK = "ADDRESS_BOOK",
	DISCOVER = "DISCOVER",
	MY = "MY",
}

export interface IBottomNavbarsItemConfig {
	badgeHide?: boolean;
	badgeNumber?: number;
	badgeType?: "number" | "dot";
	activated?: boolean;
}

export type TStateBottomNavbars = {
	[key in EBottomNavBars]: IBottomNavbarsItemConfig;
};

const INIT_VALUE: TStateBottomNavbars = {
	[EBottomNavBars.WECHAT]: {
		badgeHide: false,
		badgeNumber: 22,
	},
	[EBottomNavBars.ADDRESS_BOOK]: {},
	[EBottomNavBars.DISCOVER]: {
		badgeType: "dot",
	},
	[EBottomNavBars.MY]: {},
};

export const bottomNavbarsAtom = atomWithStorage<TStateBottomNavbars>("bottomNavbars", INIT_VALUE);

export const getBottomNavbarsValueSnapshot = () => mainStore.get(bottomNavbarsAtom);