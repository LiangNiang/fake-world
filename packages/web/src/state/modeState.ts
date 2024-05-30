import { atom } from "recoil";

export enum ModeState {
	EDIT = "edit",
	PREVIEW = "preview",
}

export const MODE_STORAGE_KEY = "modeState";

export const modeState = atom<ModeState>({
	key: "modeState",
	default: ModeState.PREVIEW,
});
