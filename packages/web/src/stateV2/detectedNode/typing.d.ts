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
import type { EMetaDataType } from "./consts";

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
		type: EMetaDataType.DialogueItem;
		index: IDialogueItem["id"];
		data: IDialogueItem;
		treeItemDisplayName: string | ((data: IDialogueItem) => string);
	}

	interface IMetaDataDialogueList extends Base {
		type: EMetaDataType.DialogueList;
		treeItemDisplayName: string;
	}

	interface IMetaDataNavigationBar extends Base {
		type: EMetaDataType.NavigationBar;
		index: EBottomNavBars;
		data: IBottomNavbarsItemConfig;
		treeItemDisplayName: string | ((data: IBottomNavbarsItemConfig) => string);
	}

	interface IMetaDataUnreadCount extends Base {
		type: EMetaDataType.UnreadCount;
		data: TStateUnreadCount;
		treeItemDisplayName: string | ((data: TStateUnreadCount) => string);
	}

	interface IMetaDataConversationList extends Base {
		type: EMetaDataType.ConversationList;
		index: IStateProfile["id"];
		treeItemDisplayName: string;
	}

	interface IMetaDataConversationItem extends Base {
		type: EMetaDataType.ConversationItem;
		index: [IStateProfile["id"], TConversationItem["id"]];
		data: TConversationItem;
		treeItemDisplayName: string | ((data: TConversationItem) => string);
	}

	interface IMetaDataConversationInput extends Base {
		type: EMetaDataType.ConversationInput;
		data: TStateConversationInputterConfig;
		treeItemDisplayName: string | ((data: TStateConversationInputterConfig) => string);
	}

	interface IMetaDataStatusBar extends Base {
		type: EMetaDataType.StatusBar;
		data: boolean;
		treeItemDisplayName: string | ((data: boolean) => string);
	}

	interface IMetaDataMyProfile extends Base {
		type: EMetaDataType.MyProfile;
		data: IStateProfile;
		treeItemDisplayName: string | ((data: IStateProfile) => string);
	}

	interface IMetaDataFriendProfile extends Base {
		type: EMetaDataType.FirendProfile;
		index: IStateProfile["id"];
		data: IStateProfile;
		treeItemDisplayName: string | ((data: IStateProfile) => string);
	}

	interface IMetaDataWallet extends Base {
		type: EMetaDataType.Wallet;
		data: TStateWallet;
		treeItemDisplayName: string | ((data: TStateWallet) => string);
	}

	interface IMetaDataFeed extends Base {
		type: EMetaDataType.MomentsFeed;
		index: IStateFeed["id"];
		data: IStateFeed;
		treeItemDisplayName: string | ((data: IStateFeed) => string);
	}

	interface IMetaDataAllFeeds extends Base {
		type: EMetaDataType.AllFeeds;
		treeItemDisplayName: string;
	}

	interface IMetaDataUserAllFeeds extends Base {
		type: EMetaDataType.UserAllFeeds;
		index: IStateProfile["id"];
		data: IStateProfile;
		treeItemDisplayName: string | ((data: IStateProfile) => string);
	}

	interface IMetaDataFeedLikes extends Base {
		type: EMetaDataType.FeedLikes;
		index: IStateFeed["id"];
		data: IStateProfile["id"][];
		treeItemDisplayName: string | ((data: IStateProfile["id"][]) => string);
	}

	interface IMetaDataFeedCommentsList extends Base {
		type: EMetaDataType.FeedCommentsList;
		index: IStateFeed["id"];
		data: IStateFeed["comments"];
		treeItemDisplayName: string;
	}

	interface IMetaDataFeedCommentsItem extends Base {
		type: EMetaDataType.FeedCommentsItem;
		index: [IStateFeed["id"], IFeedComment["id"]];
		data: IFeedComment;
		treeItemDisplayName: string | ((data: IFeedComment) => string);
	}

	interface IMetaDataTransactionRecord extends Base {
		type: EMetaDataType.TransactionRecord;
		index: TTransactionType;
		data: TTransactionDataWithType;
		treeItemDisplayName: string | ((data: TTransactionDataWithType, t: TFunction) => string);
	}

	interface IMetaDataContactsContainer extends Base {
		type: EMetaDataType.ContactsContainer;
		data: string[];
		treeItemDisplayName: string | ((data: string[]) => string);
	}

	interface IMetaDataFriendsTotalCount extends Base {
		type: EMetaDataType.FriendsTotalCount;
		data: TStateFriendsTotalCountDisplayConfig;
		treeItemDisplayName: string | ((data: TStateFriendsTotalCountDisplayConfig) => string);
	}

	interface IMetaDataMultipleDeviceLogin extends Base {
		type: EMetaDataType.MultipleDeviceLogin;
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
