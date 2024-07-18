import { dequal } from "dequal/lite";
import type { SetStateAction } from "jotai";
import { focusAtom } from "jotai-optics";
import { atomFamily } from "jotai/utils";
import atomWithStorage from "../atomWithStorage";
import type { IStateProfile } from "../profile";
import { mainStore } from "../store";
import { MOCK_INIT_CONVERSATION_LIST } from "./consts";
import type { TConversationItem } from "./typing";

export type TStateConversationList = TConversationItem[];

export const conversationListAtom = atomFamily((id: IStateProfile["id"]) => {
	return atomWithStorage<TStateConversationList>(
		`conversationList-${id}`,
		MOCK_INIT_CONVERSATION_LIST,
	);
});

export const getConversationListValueSnapshot = (id: IStateProfile["id"]) =>
	mainStore.get(conversationListAtom(id));
export const setConversationListValue = (
	id: IStateProfile["id"],
	params: SetStateAction<TStateConversationList>,
) => mainStore.set(conversationListAtom(id), params);

export const conversationItemReferenceAtom = atomFamily(
	(params: { friendId: IStateProfile["id"]; conversationId: TConversationItem["id"] }) =>
		focusAtom(conversationListAtom(params.friendId), (optic) =>
			optic.find((v) => v.id === params.conversationId),
		),
	dequal,
);
