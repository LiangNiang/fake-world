import { INIT_FEEDS } from "@/faker/wechat/moments";
import deepEqual from "fast-deep-equal";
import { type SetStateAction, atom } from "jotai";
import { focusAtom } from "jotai-optics";
import { atomFamily, atomWithStorage } from "jotai/utils";
import { groupBy } from "lodash-es";
import type { OpticFor_ } from "optics-ts";
import type { IStateProfile } from "../profile";
import { mainStore } from "../store";
import type { IStateFeed, TStateFeedLst } from "./typing";

/**
 * 所有朋友圈
 */
export const feedListAtom = atomWithStorage<TStateFeedLst>("feedList", INIT_FEEDS, undefined, {
	getOnInit: true,
});

export const getFeedListValueSnapshot = () => mainStore.get(feedListAtom);

export const setFeedListValue = (args: SetStateAction<TStateFeedLst>) =>
	mainStore.set(feedListAtom, args);

/**
 * 用户的朋友圈
 */
const __groupByUserFeedListAtom__ = atom((get) => groupBy(get(feedListAtom), "userId"));

export const userFeedListAtom = atomFamily((userId: IStateProfile["id"]) => {
	return atom((get) => get(__groupByUserFeedListAtom__)[userId] ?? []);
});

/**
 * 单条朋友圈
 */

export const feedAtom = atomFamily(
	(id: IStateFeed["id"]) =>
		focusAtom(feedListAtom, (optic: OpticFor_<TStateFeedLst>) => optic.find((v) => v.id === id)),
	deepEqual,
);

export const getFeedValueSnapshot = (id: IStateFeed["id"]) => mainStore.get(feedAtom(id));
