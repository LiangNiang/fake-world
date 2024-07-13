import type { EBottomNavBars, IBottomNavbarsItemConfig } from "@/stateV2/bottomNavbars";
import type { TConversationItem, TStateConversationInputterConfig } from "@/stateV2/conversation";
import type { IDialogueItem } from "@/stateV2/dialogueList";
import type { IFeedComment, IStateFeed } from "@/stateV2/moments";
import type { TStateMultipleDeviceLogin } from "@/stateV2/multipleDeviceLogin";
import type { IStateProfile, TStateFriendsTotalCountDisplayConfig } from "@/stateV2/profile";
import type { TTransactionDataWithType, TTransactionType } from "@/stateV2/transaction";
import type { TStateUnreadCount } from "@/stateV2/unreadCount";
import type { TStateWallet } from "@/stateV2/wallet";
import type { TFunction } from "i18next";
import type { ReactNode } from "react";
import type { MetaDataType } from "./consts";

type MakeOptional<T, K extends keyof T> = {
	[P in K]?: T[P];
} & Omit<T, K>;
type PickPropInUnion<U, P extends string | number | symbol> = U extends any ? Pick<U, P> : never;
type OmitPropInUnion<U, P extends string | number | symbol> = U extends any ? Omit<U, P> : never;
type MakeOptionalPropInUnion<U, P extends string | number | symbol> = U extends any
	? MakeOptional<U, P>
	: never;
type GetTypeInUnion<T, P extends string | number | symbol> = T extends { [K in P]?: infer U }
	? U
	: undefined;

declare namespace OverallMetaData {
	interface Base {
		type?: undefined;
		index?: undefined;
		data?: undefined;
		treeItemDisplayName?: undefined;
	}
	interface IMetaDataDialogueItem extends Base {
		type: MetaDataType.DialogueItem;
		index: IDialogueItem["id"];
		data: IDialogueItem;
		treeItemDisplayName: string | ((data: IDialogueItem) => string);
	}

	interface IMetaDataDialogueList extends Base {
		type: MetaDataType.DialogueList;
		treeItemDisplayName: string;
	}

	interface IMetaDataNavigationBar extends Base {
		type: MetaDataType.NavigationBar;
		index: EBottomNavBars;
		data: IBottomNavbarsItemConfig;
		treeItemDisplayName: string | ((data: IBottomNavbarsItemConfig) => string);
	}

	interface IMetaDataUnreadCount extends Base {
		type: MetaDataType.UnreadCount;
		data: TStateUnreadCount;
		treeItemDisplayName: string | ((data: TStateUnreadCount) => string);
	}

	interface IMetaDataConversationList extends Base {
		type: MetaDataType.ConversationList;
		index: IStateProfile["id"];
		treeItemDisplayName: string;
	}

	interface IMetaDataConversationItem extends Base {
		type: MetaDataType.ConversationItem;
		index: [IStateProfile["id"], TConversationItem["id"]];
		data: TConversationItem;
		treeItemDisplayName: string | ((data: TConversationItem) => string);
	}

	interface IMetaDataConversationInput extends Base {
		type: MetaDataType.ConversationInput;
		data: TStateConversationInputterConfig;
		treeItemDisplayName: string | ((data: TStateConversationInputterConfig) => string);
	}

	interface IMetaDataStatusBar extends Base {
		type: MetaDataType.StatusBar;
		data: boolean;
		treeItemDisplayName: string | ((data: boolean) => string);
	}

	interface IMetaDataMyProfile extends Base {
		type: MetaDataType.MyProfile;
		data: IStateProfile;
		treeItemDisplayName: string | ((data: IStateProfile) => string);
	}

	interface IMetaDataFriendProfile extends Base {
		type: MetaDataType.FirendProfile;
		index: IStateProfile["id"];
		data: IStateProfile;
		treeItemDisplayName: string | ((data: IStateProfile) => string);
	}

	interface IMetaDataWallet extends Base {
		type: MetaDataType.Wallet;
		data: TStateWallet;
		treeItemDisplayName: string | ((data: TStateWallet) => string);
	}

	interface IMetaDataFeed extends Base {
		type: MetaDataType.MomentsFeed;
		index: IStateFeed["id"];
		data: IStateFeed;
		treeItemDisplayName: string | ((data: IStateFeed) => string);
	}

	interface IMetaDataAllFeeds extends Base {
		type: MetaDataType.AllFeeds;
		treeItemDisplayName: string;
	}

	interface IMetaDataUserAllFeeds extends Base {
		type: MetaDataType.UserAllFeeds;
		index: IStateProfile["id"];
		data: IStateProfile;
		treeItemDisplayName: string | ((data: IStateProfile) => string);
	}

	interface IMetaDataFeedLikes extends Base {
		type: MetaDataType.FeedLikes;
		index: IStateFeed["id"];
		data: IStateProfile["id"][];
		treeItemDisplayName: string | ((data: IStateProfile["id"][]) => string);
	}

	interface IMetaDataFeedCommentsList extends Base {
		type: MetaDataType.FeedCommentsList;
		index: IStateFeed["id"];
		data: IStateFeed["comments"];
		treeItemDisplayName: string;
	}

	interface IMetaDataFeedCommentsItem extends Base {
		type: MetaDataType.FeedCommentsItem;
		index: [IStateFeed["id"], IFeedComment["id"]];
		data: IFeedComment;
		treeItemDisplayName: string | ((data: IFeedComment) => string);
	}

	interface IMetaDataTransactionRecord extends Base {
		type: MetaDataType.TransactionRecord;
		index: TTransactionType;
		data: TTransactionDataWithType;
		treeItemDisplayName: string | ((data: TTransactionDataWithType, t: TFunction) => string);
	}

	interface IMetaDataContactsContainer extends Base {
		type: MetaDataType.ContactsContainer;
		data: string[];
		treeItemDisplayName: string | ((data: string[]) => string);
	}

	interface IMetaDataFriendsTotalCount extends Base {
		type: MetaDataType.FriendsTotalCount;
		data: TStateFriendsTotalCountDisplayConfig;
		treeItemDisplayName: string | ((data: TStateFriendsTotalCountDisplayConfig) => string);
	}

	interface IMetaDataMultipleDeviceLogin extends Base {
		type: MetaDataType.MultipleDeviceLogin;
		data: TStateMultipleDeviceLogin;
		treeItemDisplayName: string | ((data: TStateMultipleDeviceLogin) => string);
	}

	interface IMetaDataSimple extends Base {
		treeItemDisplayName: string;
	}

	type Overall =
		| IMetaDataDialogueItem
		| IMetaDataDialogueList
		| IMetaDataNavigationBar
		| IMetaDataUnreadCount
		| IMetaDataConversationList
		| IMetaDataConversationItem
		| IMetaDataConversationInput
		| IMetaDataStatusBar
		| IMetaDataMyProfile
		| IMetaDataFriendProfile
		| IMetaDataWallet
		| IMetaDataFeed
		| IMetaDataAllFeeds
		| IMetaDataUserAllFeeds
		| IMetaDataFeedLikes
		| IMetaDataFeedCommentsItem
		| IMetaDataFeedCommentsList
		| IMetaDataTransactionRecord
		| IMetaDataContactsContainer
		| IMetaDataFriendsTotalCount
		| IMetaDataMultipleDeviceLogin
		| IMetaDataSimple;

	type OverallIndex = GetTypeInUnion<Overall, "index">;
	type OverallType = GetTypeInUnion<Overall, "type">;
	type OverallData = GetTypeInUnion<Overall, "data">;
	type OverallTreeItemDisplayName = GetTypeInUnion<Overall, "treeItemDisplayName">;
}

declare namespace StaticMetaData {
	interface IBase {
		operations?: Array<{
			element: ReactNode;
			onClick: () => unknown;
			key?: string;
		}>;
		label?: string;
	}
	type InjectMetaData = MakeOptionalPropInUnion<
		OmitPropInUnion<OverallMetaData.Overall, "data">,
		"treeItemDisplayName"
	> &
		IBase;
}
