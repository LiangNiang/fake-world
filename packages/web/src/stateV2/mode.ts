import { atom } from "jotai";
import { mainStore } from "./store";

export type TStateMode = "edit" | "preview";

export const modeAtom = atom<TStateMode>("preview");

export const getModeValueSnapshot = () => mainStore.get(modeAtom);
