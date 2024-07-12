import { SLATE_INITIAL_VALUE } from "@/wechatComponents/SlateText/utils";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { Descendant } from "slate";
import { mainStore } from "../store";
import type { TConversationRole } from "./typing";

/**
 * 聊天输入框配置
 */

export type TStateConversationInputterConfig = {
	sendRole: TConversationRole;
};

export const inputterConfigAtom = atom<TStateConversationInputterConfig>({
	sendRole: "mine",
});

export const getInputterConfigValueSnapshot = () => mainStore.get(inputterConfigAtom);

/**
 * 聊天输入框内容
 */

export const inputterValueAtom = atom<Descendant[]>(SLATE_INITIAL_VALUE);

export const getInputterValueSnapshot = () => mainStore.get(inputterValueAtom);

/**
 * 最近使用的表情
 */

export const recentUsedEmojiAtom = atomWithStorage<string[]>("recentUsedEmoji", []);
