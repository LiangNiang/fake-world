import { INIT_FRIENDS, generateFakeUser } from "@/faker/wechat/user";
import { pinyin } from "pinyin-pro";
import type { IStateProfile, TNeedGroupDataItem } from "./typing";

export const injectDefaultFriendsProfile = (id: IStateProfile["id"]): IStateProfile =>
	INIT_FRIENDS.find((v) => v.id === id) ?? generateFakeUser({ id });

export const searchS = Symbol("search");
export const topS = Symbol("top");
export const starS = Symbol("star");
export const otherS = Symbol("other");
export const NOT_SHOW_ANCHOR: (string | symbol)[] = [searchS];

export function generateNameAnchorGroup(data: TNeedGroupDataItem[]) {
	const ANCHOR_DATA = new Map<string | symbol, TNeedGroupDataItem[]>([
		[searchS, []],
		// [topS, []],
		[starS, []],
		["A", []],
		["B", []],
		["C", []],
		["D", []],
		["E", []],
		["F", []],
		["G", []],
		["H", []],
		["I", []],
		["J", []],
		["K", []],
		["L", []],
		["M", []],
		["N", []],
		["O", []],
		["P", []],
		["Q", []],
		["R", []],
		["S", []],
		["T", []],
		["U", []],
		["V", []],
		["W", []],
		["X", []],
		["Y", []],
		["Z", []],
		[otherS, []],
	]);
	for (const d of data) {
		if (d.isStarred) {
			ANCHOR_DATA.get(starS)!.push(d);
		}
		const firstLetter = pinyin(d.name, { pattern: "first", toneType: "none" })[0].toUpperCase();
		if (ANCHOR_DATA.has(firstLetter)) {
			ANCHOR_DATA.get(firstLetter)!.push(d);
		} else {
			ANCHOR_DATA.get(otherS)!.push(d);
		}
	}
	return ANCHOR_DATA;
}
