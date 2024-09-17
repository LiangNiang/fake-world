import { type SetStateAction, atom } from "jotai";
import type { CSSProperties } from "react";
import atomWithStorage from "./atomWithStorage";
import { mainStore } from "./store";

export type TStateStatusBar = {
	theme?: "light" | "dark";
	backgroundColor?: CSSProperties["backgroundColor"];
};

export type TStateStatusBarMountNode = HTMLElement | null;

export type TStateStatusBarConfig = {
	/**
	 * 是否隐藏
	 */
	hide: boolean;
	/**
	 * 信号类型
	 */
	signalIconType: "single" | "double" | "none";
	/**
	 * 电池类型
	 */
	batteryIconType: "normal" | "charging" | "low" | "saving";
	/**
	 * 网络类型
	 */
	networkIconType: "wifi" | "5G";
};

export const statusBarAtom = atom<TStateStatusBar>({});

export const getStatusBarValueSnapshot = () => mainStore.get(statusBarAtom);
export const setStatusBarValue = (args: SetStateAction<TStateStatusBar>) =>
	mainStore.set(statusBarAtom, args);

export const statusBarMountNodeAtom = atom<TStateStatusBarMountNode>(null);

export const statusBarConfigAtom = atomWithStorage<TStateStatusBarConfig>("statusBarConfig", {
	hide: false,
	signalIconType: "single",
	batteryIconType: "normal",
	networkIconType: "wifi",
});
