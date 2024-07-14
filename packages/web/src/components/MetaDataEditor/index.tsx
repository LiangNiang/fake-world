import {
	EMetaDataType,
	type StaticMetaData,
	activatedNodeAtom,
	getNodeFreshDataValueSnapshot,
	nodeInjectMetaDataAtom,
} from "@/stateV2/detectedNode";
import { Global, css } from "@emotion/react";
import { App, Tabs } from "antd";
import { useAtomValue } from "jotai";
import { memo, useCallback } from "react";
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
import TransactionRecordMetaDataEditor from "./TransactionRecordMetaDataEditor";
import UnreadMetaDataEditor from "./UnreadMetaDataEditor";
import {
	FriendProfileMetaDataEditor,
	FriendsTotlaMetaDataEditor,
	MyProfileMetaDataEditor,
	NewUserMetaDataEditor,
} from "./UserProfileMetaDataEditor";
import WalletMetaDataEditor from "./WalletMetaDataEditor";

const TYPE_MAP_COMPONENT = {
	[EMetaDataType.DialogueItem]: DialogueItemMetaDataEditor,
	[EMetaDataType.NavigationBar]: NavigationBarMetaDataEditor,
	[EMetaDataType.DialogueList]: DialogueListMetaDataEditor,
	[EMetaDataType.UnreadCount]: UnreadMetaDataEditor,
	[EMetaDataType.ConversationInput]: ConversationInputMetaDataEditor,
	[EMetaDataType.ConversationList]: ConversationListMetaDataEditor,
	[EMetaDataType.ConversationItem]: ConversationItemMetaDataEditor,
	[EMetaDataType.StatusBar]: StatusBarMetaDataEditor,
	[EMetaDataType.MyProfile]: MyProfileMetaDataEditor,
	[EMetaDataType.FirendProfile]: FriendProfileMetaDataEditor,
	[EMetaDataType.Wallet]: WalletMetaDataEditor,
	[EMetaDataType.MomentsFeed]: FeedMetaDataEditor,
	[EMetaDataType.AllFeeds]: AllFeedsMetaDataEditor,
	[EMetaDataType.FeedLikes]: FeedLikeMetaDataEditor,
	[EMetaDataType.FeedCommentsItem]: FeedCommentItemMetaDataEditor,
	[EMetaDataType.FeedCommentsList]: FeedCommentsListMetaDataEditor,
	[EMetaDataType.UserAllFeeds]: AllFeedsMetaDataEditor,
	[EMetaDataType.TransactionRecord]: TransactionRecordMetaDataEditor,
	[EMetaDataType.ContactsContainer]: NewUserMetaDataEditor,
	[EMetaDataType.FriendsTotalCount]: FriendsTotlaMetaDataEditor,
	[EMetaDataType.MultipleDeviceLogin]: MultipleDeviceLoginEditor,
};

const MetaDataEditor = () => {
	const { isPreview } = useMode();
	const activatedNode = useAtomValue(activatedNodeAtom);
	const metaData = useAtomValue(nodeInjectMetaDataAtom(activatedNode ?? ""));

	const renderMetaDataEditorBySingleMetaData = useCallback(
		(metaData?: StaticMetaData.InjectMetaData, freshDataIndex?: number) => {
			const nodeData = getNodeFreshDataValueSnapshot(activatedNode ?? "");
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

export default memo(MetaDataEditor);
