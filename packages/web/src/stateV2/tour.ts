import { atomWithReset, atomWithStorage } from "jotai/utils";
import { mainStore } from "./store";

export type TStateTourTarget = {
	ref1: HTMLElement | null;
	ref2: HTMLElement | null;
};

export const touredAtom = atomWithStorage("toured", false, undefined, { getOnInit: true });

export const getTouredValueSnapshot = () => mainStore.get(touredAtom);

export const tourTargetAtom = atomWithReset<TStateTourTarget>({
	ref1: null,
	ref2: null,
});
