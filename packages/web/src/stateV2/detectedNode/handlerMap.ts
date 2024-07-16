import { MYSELF_ID } from "@/faker/wechat/user";
import { type EBottomNavBars, bottomNavbarsAtom } from "@/stateV2/bottomNavbars";
import { conversationListAtom, inputterConfigAtom } from "@/stateV2/conversation";
import { dialogueListAtom } from "@/stateV2/dialogueList";
import { feedListAtom } from "@/stateV2/moments";
import { multipleDeviceLoginAtom } from "@/stateV2/multipleDeviceLogin";
import {
	allProfilesAtom,
	allProfilesIdsAtom,
	friendsTotalCountDisplayConfigAtom,
} from "@/stateV2/profile";
import { statusBarHideAtom } from "@/stateV2/statusBar";
import { type TTransactionData, type TTransactionType, USED_ATOM_MAP } from "@/stateV2/transaction";
import { unreadCountAtom } from "@/stateV2/unreadCount";
import { walletAtom } from "@/stateV2/wallet";
import type { Getter } from "jotai";
import { EMetaDataType } from "./consts";
import type { OverallMetaData } from "./typing";

export type ParamsType = {
	type: OverallMetaData.OverallType;
	index: OverallMetaData.OverallIndex;
};

type HandlerMap = {
	[key in EMetaDataType]?: (
		get: Getter,
		index?: OverallMetaData.OverallIndex,
	) => OverallMetaData.OverallData;
};

const handlerMap: HandlerMap = {
	[EMetaDataType.DialogueItem]: (get, index) => get(dialogueListAtom).find((v) => v.id === index),
	[EMetaDataType.NavigationBar]: (get, index) => get(bottomNavbarsAtom)[index as EBottomNavBars],
	[EMetaDataType.UnreadCount]: (get) => get(unreadCountAtom),
	[EMetaDataType.ConversationItem]: (get, index) =>
		index && index.length === 2
			? get(conversationListAtom(index[0])).find((v) => v.id === index[1])
			: undefined,
	[EMetaDataType.ConversationInput]: (get) => get(inputterConfigAtom),
	[EMetaDataType.StatusBar]: (get) => get(statusBarHideAtom),
	[EMetaDataType.MyProfile]: (get) => get(allProfilesAtom).find((v) => v.id === MYSELF_ID),
	[EMetaDataType.FirendProfile]: (get, index) => get(allProfilesAtom).find((v) => v.id === index),
	[EMetaDataType.Wallet]: (get) => get(walletAtom),
	[EMetaDataType.MomentsFeed]: (get, index) => get(feedListAtom).find((v) => v.id === index),
	[EMetaDataType.FeedLikes]: (get, index) =>
		get(feedListAtom).find((v) => v.id === index)?.likeUserIds ?? [],
	[EMetaDataType.FeedCommentsItem]: (get, index) =>
		index && index.length === 2
			? get(feedListAtom)
					.find((v) => v.id === index[0])
					?.comments?.find((v) => v.id === index[1])
			: undefined,
	[EMetaDataType.FeedCommentsList]: (get, index) =>
		get(feedListAtom).find((v) => v.id === index)?.comments,
	[EMetaDataType.UserAllFeeds]: (get, index) => get(allProfilesAtom).find((v) => v.id === index),
	[EMetaDataType.TransactionRecord]: (get, index) =>
		get(USED_ATOM_MAP[index as TTransactionType]) as TTransactionData,
	[EMetaDataType.ContactsContainer]: (get) => get(allProfilesIdsAtom),
	[EMetaDataType.FriendsTotalCount]: (get) => get(friendsTotalCountDisplayConfigAtom),
	[EMetaDataType.MultipleDeviceLogin]: (get) => get(multipleDeviceLoginAtom),
};

export default handlerMap;
