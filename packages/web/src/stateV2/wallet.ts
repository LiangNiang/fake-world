import atomWithStorage from "./base";
import { mainStore } from "./store";

export type TStateWallet = {
	/** 零钱余额 */
	balance: string;
	/** 零钱通 */
	miniFund: string;
	/** 零钱通收益率，单位 % */
	miniFundYield: string;
};

export const walletAtom = atomWithStorage<TStateWallet>("wallet", {
	balance: "520.00",
	miniFund: "1314.00",
	miniFundYield: "2.75",
});

export const getWalletVauleSnapshot = () => mainStore.get(walletAtom);
