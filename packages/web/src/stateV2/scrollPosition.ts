import deepEqual from "fast-deep-equal";
import { atomFamily, atomWithStorage } from "jotai/utils";
import { mainStore } from "./store";

export const scrollPositionAtomFamily = atomFamily((param: string) => {
	return atomWithStorage<ScrollToOptions | null>(`scrollPosition-${param}`, null, undefined, {
		getOnInit: true,
	});
}, deepEqual);

export const getScrollPositionValueSnapshot = (param: string) =>
	mainStore.get(scrollPositionAtomFamily(param));
