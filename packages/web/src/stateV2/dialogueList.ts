import { dequal } from "dequal/lite";
import type { SetStateAction } from "jotai";
import { atomEffect } from "jotai-effect";
import { focusAtom } from "jotai-optics";
import { atomFamily } from "jotai/utils";
import type { OpticFor_ } from "optics-ts";
import atomWithStorage from "./atomWithStorage";
import type { IStateProfile } from "./profile";
import { mainStore } from "./store";
import { getUnreadCountValueSnapshot, unreadCountAtom } from "./unreadCount";

export interface IDialogueItem {
	id: string;
	/** 对话关联的好友 id */
	friendId: IStateProfile["id"];
	/** 最后一条消息，将显示在对话列表中 */
	lastMessage: string;
	/** 最后一条消息时间 */
	lastMessageTime: string;
	/** 是否置顶 */
	isPinned?: boolean;
	/** 是否静音 */
	isMuted?: boolean;
	/** 是否隐藏未读角标 */
	badgeHide?: boolean;
	/** 未读消息数量 */
	unreadMarkNumber?: number;
	/** 未读消息显示类型，数字或者小红点 */
	unreadDisplayType?: "number" | "dot";
}

export type TStateDialogueList = IDialogueItem[];

export const dialogueListAtom = atomWithStorage<TStateDialogueList>("dialogueList", [
	{
		id: "1",
		friendId: "1",
		lastMessage: "你好，我是塞尔达",
		lastMessageTime: "12:55",
		isPinned: true,
		unreadMarkNumber: 12,
	},
	{
		id: "3",
		friendId: "4",
		lastMessage: "我是 luigi",
		lastMessageTime: "09:23",
		unreadMarkNumber: 1,
	},
	{
		id: "2",
		friendId: "2",
		lastMessage: "我是星之笨比bot",
		lastMessageTime: "星期四",
		isMuted: true,
	},
]);

export const dialogueListEffect = atomEffect((get, set) => {
	const dialogueList = get(dialogueListAtom);
	const { calcuateType } = getUnreadCountValueSnapshot();
	if (calcuateType === "auto") {
		const count = dialogueList.reduce((acc, dialogue) => {
			if (
				!dialogue.badgeHide &&
				dialogue.unreadDisplayType !== "dot" &&
				typeof dialogue.unreadMarkNumber === "number"
			) {
				return acc + dialogue.unreadMarkNumber;
			}
			return acc;
		}, 0);
		set(unreadCountAtom, (v) => ({ ...v, count }));
	}
});

export const getDialogueListValueSnapshot = () => mainStore.get(dialogueListAtom);
export const setDialogueListValue = (args: SetStateAction<TStateDialogueList>) =>
	mainStore.set(dialogueListAtom, args);

export const dialogueItemAtom = atomFamily(
	(id: IDialogueItem["id"]) =>
		focusAtom(dialogueListAtom, (optic: OpticFor_<TStateDialogueList>) =>
			optic.find((v) => v.id === id),
		),
	dequal,
);
