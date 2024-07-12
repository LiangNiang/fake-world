import { getUnreadCountSnapshot } from "@/stateV2/unreadCount";
import { type GetRecoilValue, selectorFamily } from "recoil";
import btmNavbarsState, { type BottomNavBars } from "../btmNavbarsState";
import { conversationInputState, conversationState } from "../conversationState";
import { dialogueItemState } from "../dialogueState";
import { feedState } from "../moments";
import { multipleDeviceLoginState } from "../multipleDeviceLoginState";
import { friendState, friendsIdsState, friendsTotalCountState, myProfileState } from "../profile";
import { statusBarHideState } from "../statusBarState";
import { type TTransactionType, USED_STATE_MAP } from "../transaction";
import { walletState } from "../walletState";
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
	[MetaDataType.DialogueItem]: (get, index) => get(dialogueItemState(index as string)),
	[MetaDataType.NavigationBar]: (get, index) => get(btmNavbarsState)[index as BottomNavBars],
	[MetaDataType.UnreadCount]: () => getUnreadCountSnapshot(),
	[MetaDataType.ConversationItem]: (get, index) =>
		index && index.length === 2
			? get(conversationState(index[0])).find((v) => v.id === index[1])
			: undefined,
	[MetaDataType.ConversationInput]: (get) => get(conversationInputState),
	[MetaDataType.StatusBar]: (get) => get(statusBarHideState),
	[MetaDataType.MyProfile]: (get) => get(myProfileState),
	[MetaDataType.FirendProfile]: (get, index) => get(friendState(index as string)),
	[MetaDataType.Wallet]: (get) => get(walletState),
	[MetaDataType.MomentsFeed]: (get, index) => get(feedState(index as string)),
	[MetaDataType.FeedLikes]: (get, index) => get(feedState(index as string))?.likeUserIds ?? [],
	[MetaDataType.FeedCommentsItem]: (get, index) =>
		index && index.length === 2
			? get(feedState(index[0]))?.comments?.find((v) => v.id === index[1])
			: undefined,
	[MetaDataType.FeedCommentsList]: (get, index) => get(feedState(index as string))?.comments,
	[MetaDataType.UserAllFeeds]: (get, index) => get(friendState(index as string)),
	[MetaDataType.TransactionRecord]: (get, index) => ({
		...get(USED_STATE_MAP[index as TTransactionType]),
		type: index,
	}),
	[MetaDataType.ContactsContainer]: (get) => get(friendsIdsState),
	[MetaDataType.FriendsTotalCount]: (get) => get(friendsTotalCountState),
	[MetaDataType.MultipleDeviceLogin]: (get) => get(multipleDeviceLoginState),
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
