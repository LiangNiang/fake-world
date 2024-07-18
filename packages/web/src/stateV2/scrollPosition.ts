import { dequal } from "dequal/lite";
import { atomFamily } from "jotai/utils";
import atomWithStorage from "./base";
import { mainStore } from "./store";

export const scrollPositionAtomFamily = atomFamily((param: string) => {
	return atomWithStorage<ScrollToOptions | null>(`scrollPosition-${param}`, null);
}, dequal);

export const getScrollPositionValueSnapshot = (param: string) =>
	mainStore.get(scrollPositionAtomFamily(param));
