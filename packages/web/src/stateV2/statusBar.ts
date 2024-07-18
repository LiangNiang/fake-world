import { type SetStateAction, atom } from "jotai";
import type { CSSProperties } from "react";
import atomWithStorage from "./atomWithStorage";
import { mainStore } from "./store";

export type TStateStatusBar = {
	theme?: "light" | "dark";
	backgroundColor?: CSSProperties["backgroundColor"];
};

export type TStateStatusBarMountNode = HTMLElement | null;

export type TStateStatusBarHide = boolean;

export const statusBarAtom = atom<TStateStatusBar>({});

export const getStatusBarValueSnapshot = () => mainStore.get(statusBarAtom);
export const setStatusBarValue = (args: SetStateAction<TStateStatusBar>) =>
	mainStore.set(statusBarAtom, args);

export const statusBarMountNodeAtom = atom<TStateStatusBarMountNode>(null);

export const statusBarHideAtom = atomWithStorage<TStateStatusBarHide>("statusBarHide", false);

export const getStatusBarHideVauleSnapshot = () => mainStore.get(statusBarHideAtom);
