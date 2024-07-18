import atomWithStorage from "./atomWithStorage";

export enum EMenus {
	Main = "main",
	Trees = "trees",
	Code = "code",
	Git = "git",
}

export type IStateActivatedMenu = EMenus;

export const activatedMenuAtom = atomWithStorage<IStateActivatedMenu>("activatedMenu", EMenus.Main);
