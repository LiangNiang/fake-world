import { Global, css } from "@emotion/react";
import { App, Tabs } from "antd";
import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { getRecoil } from "recoil-nexus";

import {
	MetaDataType,
	activatedNodeState,
	nodeFreshDataState,
	nodeInjectMetaState,
} from "@/state/detectedNode";
import type { StaticMetaData } from "@/state/detectedNode/typing";

import useMode from "../useMode";
import AllFeedsMetaDataEditor from "./AllFeedsMetaDataEditor";
import ConversationInputMetaDataEditor from "./ConversationInputMetaDataEditor";
import {
	ConversationItemMetaDataEditor,
	ConversationListMetaDataEditor,
} from "./ConversationMetaDataEditor";
import DialogueItemMetaDataEditor from "./DialogueItemMetaDataEditor";
import DialogueListMetaDataEditor from "./DialogueListMetaDataEditor";
import FeedCommentItemMetaDataEditor from "./FeedCommentItemMetaDataEditor";
import FeedCommentsListMetaDataEditor from "./FeedCommentsListMetaDataEditor";
import FeedLikeMetaDataEditor from "./FeedLikeMetaDataEditor";
import FeedMetaDataEditor from "./FeedMetaDataEditor";
import MultipleDeviceLoginEditor from "./MultipleDeviceLoginEditor";
import NavigationBarMetaDataEditor from "./NavigationBarMetaDataEditor";
import StatusBarMetaDataEditor from "./StatusBarMetaDataEditor";
import UnreadMetaDataEditor from "./UnreadMetaDataEditor";
import TransactionRecordMetaDataEditor from "./TransactionRecordMetaDataEditor";
import {
	FriendProfileMetaDataEditor,
	FriendsTotlaMetaDataEditor,
	MyProfileMetaDataEditor,
	NewUserMetaDataEditor,
} from "./UserProfileMetaDataEditor";
import WalletMetaDataEditor from "./WalletMetaDataEditor";

const TYPE_MAP_COMPONENT = {
	[MetaDataType.DialogueItem]: DialogueItemMetaDataEditor,
	[MetaDataType.NavigationBar]: NavigationBarMetaDataEditor,
	[MetaDataType.DialogueList]: DialogueListMetaDataEditor,
	[MetaDataType.UnreadCount]: UnreadMetaDataEditor,
	[MetaDataType.ConversationInput]: ConversationInputMetaDataEditor,
	[MetaDataType.ConversationList]: ConversationListMetaDataEditor,
	[MetaDataType.ConversationItem]: ConversationItemMetaDataEditor,
	[MetaDataType.StatusBar]: StatusBarMetaDataEditor,
	[MetaDataType.MyProfile]: MyProfileMetaDataEditor,
	[MetaDataType.FirendProfile]: FriendProfileMetaDataEditor,
	[MetaDataType.Wallet]: WalletMetaDataEditor,
	[MetaDataType.MomentsFeed]: FeedMetaDataEditor,
	[MetaDataType.AllFeeds]: AllFeedsMetaDataEditor,
	[MetaDataType.FeedLikes]: FeedLikeMetaDataEditor,
	[MetaDataType.FeedCommentsItem]: FeedCommentItemMetaDataEditor,
	[MetaDataType.FeedCommentsList]: FeedCommentsListMetaDataEditor,
	[MetaDataType.UserAllFeeds]: AllFeedsMetaDataEditor,
	[MetaDataType.TransactionRecord]: TransactionRecordMetaDataEditor,
	[MetaDataType.ContactsContainer]: NewUserMetaDataEditor,
	[MetaDataType.FriendsTotalCount]: FriendsTotlaMetaDataEditor,
	[MetaDataType.MultipleDeviceLogin]: MultipleDeviceLoginEditor,
};

export const MetaDataEditor = () => {
	const { isPreview } = useMode();
	const activatedNode = useRecoilValue(activatedNodeState);
	const metaData = useRecoilValue(nodeInjectMetaState(activatedNode ?? ""));

	const renderMetaDataEditorBySingleMetaData = useCallback(
		(metaData?: StaticMetaData.InjectMetaData, freshDataIndex?: number) => {
			const nodeData = getRecoil(nodeFreshDataState(activatedNode ?? ""));
			if (!metaData || !metaData.type) {
				return <>该节点没有配置 metadata</>;
			}
			const { index, type } = metaData;
			const UsedComponent: (props: EditorProps) => JSX.Element =
				TYPE_MAP_COMPONENT[type as keyof typeof TYPE_MAP_COMPONENT];
			if (!UsedComponent) {
				return <>该节点没有配置编辑表单</>;
			}
			return (
				<UsedComponent
					data={
						Array.isArray(nodeData) && freshDataIndex !== undefined
							? nodeData[freshDataIndex]
							: nodeData
					}
					key={JSON.stringify(index)}
					index={index}
				/>
			);
		},
		[metaData],
	);

	if (isPreview) {
		return <>进入编辑模式并点选节点来实时编辑任何数据</>;
	}

	if (!activatedNode) {
		return <>点选节点来实时编辑任何数据</>;
	}

	if (!metaData) {
		return <>实时数据获取失败</>;
	}

	if (Array.isArray(metaData)) {
		const tabItems = metaData.map((metaData, index) => ({
			key: String(index),
			label: metaData.label ?? "",
			children: renderMetaDataEditorBySingleMetaData(metaData, index),
		}));

		return (
			<>
				<Global
					styles={css`
            .ant-tabs-tab {
              padding-top: 0 !important;
            }
          `}
				/>
				<Tabs defaultActiveKey="0" items={tabItems} />
			</>
		);
	}
	return (
		<App>
			{metaData?.label && <div className="mb-4">{metaData.label}</div>}
			{renderMetaDataEditorBySingleMetaData(metaData)}
		</App>
	);
};
