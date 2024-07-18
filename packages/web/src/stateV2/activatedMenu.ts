import atomWithStorage from "./base";

export enum EMenus {
	Main = "main",
	Trees = "trees",
	Code = "code",
	Git = "git",
}

export type IStateActivatedMenu = EMenus;

export const activatedMenuAtom = atomWithStorage<IStateActivatedMenu>("activatedMenu", EMenus.Main);
