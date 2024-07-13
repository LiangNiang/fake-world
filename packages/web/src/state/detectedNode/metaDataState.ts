import { type EBottomNavBars, getBottomNavbarsValueSnapshot } from "@/stateV2/bottomNavbars";
import {
	getConversationListValueSnapshot,
	getInputterConfigValueSnapshot,
} from "@/stateV2/conversation";
import { getDialogueListValueSnapshot } from "@/stateV2/dialogueList";
import { getMultipleDeviceLoginValueSnapshot } from "@/stateV2/multipleDeviceLogin";
import { getStatusBarHideVauleSnapshot } from "@/stateV2/statusBar";
import { type TTransactionType, getUsedTransactionValueSnapshot } from "@/stateV2/transaction";
import { getUnreadCountValueSnapshot } from "@/stateV2/unreadCount";
import { getWalletVauleSnapshot } from "@/stateV2/wallet";
import { type GetRecoilValue, selectorFamily } from "recoil";
import { feedState } from "../moments";
import { friendState, friendsIdsState, friendsTotalCountState, myProfileState } from "../profile";
import { MetaDataType } from "./consts";
import type { OverallMetaData } from "./typing";

export type ParamsType = {
	type: OverallMetaData.OverallType;
	index: OverallMetaData.OverallIndex;
};

type HandlerMap = {
	[key in MetaDataType]?: (
		get: GetRecoilValue,
		index?: OverallMetaData.OverallIndex,
	) => OverallMetaData.OverallData;
};

const handlerMap: HandlerMap = {
	[MetaDataType.DialogueItem]: (_, index) =>
		getDialogueListValueSnapshot().find((v) => v.id === index),
	[MetaDataType.NavigationBar]: (_, index) =>
		getBottomNavbarsValueSnapshot()[index as EBottomNavBars],
	[MetaDataType.UnreadCount]: () => getUnreadCountValueSnapshot(),
	[MetaDataType.ConversationItem]: (_, index) =>
		index && index.length === 2
			? getConversationListValueSnapshot(index[0]).find((v) => v.id === index[1])
			: undefined,
	[MetaDataType.ConversationInput]: () => getInputterConfigValueSnapshot(),
	[MetaDataType.StatusBar]: () => getStatusBarHideVauleSnapshot(),
	[MetaDataType.MyProfile]: (get) => get(myProfileState),
	[MetaDataType.FirendProfile]: (get, index) => get(friendState(index as string)),
	[MetaDataType.Wallet]: () => getWalletVauleSnapshot(),
	[MetaDataType.MomentsFeed]: (get, index) => get(feedState(index as string)),
	[MetaDataType.FeedLikes]: (get, index) => get(feedState(index as string))?.likeUserIds ?? [],
	[MetaDataType.FeedCommentsItem]: (get, index) =>
		index && index.length === 2
			? get(feedState(index[0]))?.comments?.find((v) => v.id === index[1])
			: undefined,
	[MetaDataType.FeedCommentsList]: (get, index) => get(feedState(index as string))?.comments,
	[MetaDataType.UserAllFeeds]: (get, index) => get(friendState(index as string)),
	[MetaDataType.TransactionRecord]: (_, index) =>
		getUsedTransactionValueSnapshot(index as TTransactionType),
	[MetaDataType.ContactsContainer]: (get) => get(friendsIdsState),
	[MetaDataType.FriendsTotalCount]: (get) => get(friendsTotalCountState),
	[MetaDataType.MultipleDeviceLogin]: () => getMultipleDeviceLoginValueSnapshot(),
};

export const nodeRuntimeState = selectorFamily<OverallMetaData.OverallData, ParamsType>({
	key: "nodeRuntimeState",
	get:
		(param) =>
		({ get }) => {
			const { type, index } = param;
			const handler = handlerMap[type!];
			return handler ? handler(get, index) : undefined;
		},
});
