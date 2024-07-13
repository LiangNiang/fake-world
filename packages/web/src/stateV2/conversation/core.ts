import type { SetStateAction } from "jotai";
import { focusAtom } from "jotai-optics";
import { atomFamily, atomWithStorage } from "jotai/utils";
import type { OpticFor_ } from "optics-ts";
import { useCallback } from "react";
import type { IStateProfile } from "../profile";
import { mainStore } from "../store";
import { MOCK_INIT_CONVERSATION_LIST } from "./consts";
import type { TConversationItem } from "./typing";

export type TStateConversationList = TConversationItem[];

export const conversationListAtom = atomFamily((id: IStateProfile["id"]) => {
	return atomWithStorage<TStateConversationList>(
		`conversationList-${id}`,
		MOCK_INIT_CONVERSATION_LIST,
		undefined,
		{
			getOnInit: true,
		},
	);
});

export const getConversationListValueSnapshot = (id: IStateProfile["id"]) =>
	mainStore.get(conversationListAtom(id));
export const setConversationListValue = (
	id: IStateProfile["id"],
	params: SetStateAction<TStateConversationList>,
) => mainStore.set(conversationListAtom(id), params);

export const conversationItemReferenceAtom = (
	friendId: IStateProfile["id"],
	conversationId: TConversationItem["id"],
) =>
	focusAtom(
		conversationListAtom(friendId),
		useCallback(
			(optic: OpticFor_<TStateConversationList>) => optic.find((v) => v.id === conversationId),
			[],
		),
	);