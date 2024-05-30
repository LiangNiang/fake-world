import { atom } from "recoil";

import { persistAtom } from "./effects";

export interface IWallet {
	/** 零钱余额 */
	balance: string;
	/** 零钱通 */
	miniFund: string;
	/** 零钱通收益率，单位 % */
	miniFundYield: string;
}

export const walletState = atom<IWallet>({
	key: "walletState",
	default: {
		balance: "520.00",
		miniFund: "1314.00",
		miniFundYield: "2.75",
	},
	effects_UNSTABLE: [persistAtom],
});
