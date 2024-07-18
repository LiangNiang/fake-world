import { createJSONStorage, atomWithStorage as jotaiAtomWithStorage } from "jotai/utils";
import type { SyncStorage } from "jotai/vanilla/utils/atomWithStorage";

const storage = createJSONStorage();

export const storageEventEmitter = new EventTarget();

export const STORAEG_UPDATE_KEY = "STORAEG_UPDATE";

function atomWithStorage<Value>(key: string, initialValue: Value) {
	return jotaiAtomWithStorage<Value>(
		key,
		initialValue,
		{
			...storage,
			setItem: (...params) => {
				storage.setItem(...params);
				storageEventEmitter.dispatchEvent(new CustomEvent(STORAEG_UPDATE_KEY, { detail: params }));
			},
		} as SyncStorage<Value>,
		{ getOnInit: true },
	);
}

export default atomWithStorage;
