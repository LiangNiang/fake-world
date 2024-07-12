import type { EBottomNavBars, IBottomNavbarsItemConfig } from "@/stateV2/bottomNavbars";
import type { TStateMultipleDeviceLogin } from "@/stateV2/multipleDeviceLogin";
import type { TStateUnreadCount } from "@/stateV2/unreadCount";
import type { TFunction } from "i18next";
import type { ReactNode } from "react";
import type { IConversationInputConfig, TConversationItem } from "../conversationState";
import type { IDialogueItem } from "../dialogueState";
import type { IFeed, IFeedComment } from "../moments";
import type { IFriendsTotalCountDisplay, IProfile } from "../profile";
import type { TTransactionDataWithType, TTransactionType } from "../transaction";
import type { IWallet } from "../walletState";
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
		index: IProfile["id"];
		treeItemDisplayName: string;
	}

	interface IMetaDataConversationItem extends Base {
		type: MetaDataType.ConversationItem;
		index: [IProfile["id"], TConversationItem["id"]];
		data: TConversationItem;
		treeItemDisplayName: string | ((data: TConversationItem) => string);
	}

	interface IMetaDataConversationInput extends Base {
		type: MetaDataType.ConversationInput;
		data: IConversationInputConfig;
		treeItemDisplayName: string | ((data: IConversationInputConfig) => string);
	}

	interface IMetaDataStatusBar extends Base {
		type: MetaDataType.StatusBar;
		data: boolean;
		treeItemDisplayName: string | ((data: boolean) => string);
	}

	interface IMetaDataMyProfile extends Base {
		type: MetaDataType.MyProfile;
		data: IProfile;
		treeItemDisplayName: string | ((data: IProfile) => string);
	}

	interface IMetaDataFriendProfile extends Base {
		type: MetaDataType.FirendProfile;
		index: IProfile["id"];
		data: IProfile;
		treeItemDisplayName: string | ((data: IProfile) => string);
	}

	interface IMetaDataWallet extends Base {
		type: MetaDataType.Wallet;
		data: IWallet;
		treeItemDisplayName: string | ((data: IWallet) => string);
	}

	interface IMetaDataFeed extends Base {
		type: MetaDataType.MomentsFeed;
		index: IFeed["id"];
		data: IFeed;
		treeItemDisplayName: string | ((data: IFeed) => string);
	}

	interface IMetaDataAllFeeds extends Base {
		type: MetaDataType.AllFeeds;
		treeItemDisplayName: string;
	}

	interface IMetaDataUserAllFeeds extends Base {
		type: MetaDataType.UserAllFeeds;
		index: IProfile["id"];
		data: IProfile;
		treeItemDisplayName: string | ((data: IProfile) => string);
	}

	interface IMetaDataFeedLikes extends Base {
		type: MetaDataType.FeedLikes;
		index: IFeed["id"];
		data: IProfile["id"][];
		treeItemDisplayName: string | ((data: IProfile["id"][]) => string);
	}

	interface IMetaDataFeedCommentsList extends Base {
		type: MetaDataType.FeedCommentsList;
		index: IFeed["id"];
		data: IFeed["comments"];
		treeItemDisplayName: string;
	}

	interface IMetaDataFeedCommentsItem extends Base {
		type: MetaDataType.FeedCommentsItem;
		index: [IFeed["id"], IFeedComment["id"]];
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
		data: IFriendsTotalCountDisplay;
		treeItemDisplayName: string | ((data: IFriendsTotalCountDisplay) => string);
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
