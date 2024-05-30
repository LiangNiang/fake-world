import { recoilPersist } from "recoil-persist";

import { getCurrentStorageKey } from "@/dataSource";

const CURRENT_STORAGE_KEY = getCurrentStorageKey();

export const GLOBAL_CONFIG_STORAGE_KEY = "global-config";

export const persistEventEmitter = new EventTarget();

export const PERSIST_UPDATE_KEY = "persist-update";

const { persistAtom: globalConfigPersistAtom } = recoilPersist({
	key: GLOBAL_CONFIG_STORAGE_KEY,
});

const { persistAtom } = recoilPersist({
	key: CURRENT_STORAGE_KEY,
	storage: {
		getItem: (...params) => localStorage.getItem(...params),
		setItem: (...params) => {
			localStorage.setItem(...params);
			persistEventEmitter.dispatchEvent(new CustomEvent(PERSIST_UPDATE_KEY, { detail: params }));
		},
	},
});

export { globalConfigPersistAtom, persistAtom };
