import { atom } from "recoil";

import { globalConfigPersistAtom } from "../effects";

export enum EMenus {
	Main = "main",
	Trees = "trees",
	Code = "code",
	Git = "git",
}

interface IGlobalConfig {
	activatedMenu: EMenus;
}

export const menuState = atom<IGlobalConfig["activatedMenu"]>({
	key: "menuState",
	default: EMenus.Main,
	effects_UNSTABLE: [globalConfigPersistAtom],
});
