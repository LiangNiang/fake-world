import { atom } from "recoil";

import { persistAtom } from "./effects";

export enum CalcuateType {
	STATIC = "static",
	AUTO = "auto",
}

export interface ITotalUnreadCountState {
	count: number;
	calcuateType: CalcuateType;
}

const totalUnreadCountState = atom<ITotalUnreadCountState>({
	key: "totalUnreadCountBaseState",
	default: {
		count: 13,
		calcuateType: CalcuateType.AUTO,
	},
	effects_UNSTABLE: [persistAtom],
});

export default totalUnreadCountState;
