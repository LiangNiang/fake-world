import { atom } from "jotai";
import atomWithStorage from "./atomWithStorage";
import { mainStore } from "./store";

export type TStateTourTarget = {
	ref1: HTMLElement | null;
	ref2: HTMLElement | null;
};

export const touredAtom = atomWithStorage("toured", false);

export const getTouredValueSnapshot = () => mainStore.get(touredAtom);

export const tourTargetAtom = atom<TStateTourTarget>({
	ref1: null,
	ref2: null,
});
