import { canBeDetected } from "@/components/NodeDetected";
import TopOperations from "@/components/TopOperations";
import useMode from "@/components/useMode";
import {
	ConversationTypeLabel,
	EConversationType,
	type IConversationTypeTransfer,
	type TConversationItem,
	conversationListAtom,
	getConversationListValueSnapshot,
} from "@/stateV2/conversation";
import { EMetaDataType, type StaticMetaData, allNodesTreeAtom } from "@/stateV2/detectedNode";
import { SubnodeOutlined } from "@ant-design/icons";
import { Modal, Tooltip } from "antd";
import { useAtom, useSetAtom } from "jotai";
import { useMemo } from "react";
import { ReactSortable } from "react-sortablejs";
import { twJoin } from "tailwind-merge";
import { useConversationAPI } from "../context";
import ConversationItem from "./ConversationItem";

const ConversationList = () => {
	const { listRef, conversationId, sendTransfer, sendRedPacketAcceptedReply } =
		useConversationAPI();
	const [conversationList, setConversationList] = useAtom(conversationListAtom(conversationId));
	const { isEdit } = useMode();
	const rebuildTree = useSetAtom(allNodesTreeAtom);

	const mappedSortableListData = useMemo(() => {
		return conversationList.map((item) => ({
			id: item.id,
		}));
	}, [conversationList]);

	const handleOperationDelete = (id: TConversationItem["id"]) => {
		Modal.confirm({
			title: "是否删除该聊天记录？",
			onOk: () => {
				setConversationList((prev) => prev.filter((v) => v.id !== id));
			},
		});
	};

	const generateTransferReplyConversation = (conversationItemId: TConversationItem["id"]) => {
		const item = getConversationListValueSnapshot(conversationId).find(
			(v) => v.id === conversationItemId,
		);
		const { amount, originalSender, role } = item as IConversationTypeTransfer;
		setConversationList((prev) =>
			prev.map((item) =>
				item.id === conversationItemId
					? ({ ...item, transferStatus: "accepted" } as TConversationItem)
					: item,
			),
		);
		sendTransfer({
			amount,
			transferStatus: "accepted",
			originalSender,
			role: role === "mine" ? "friend" : "mine",
		});
	};

	const generateRedPacketAcceptedReplyConversation = (
		conversationItemId: TConversationItem["id"],
	) => {
		setConversationList((prev) =>
			prev.map((item) =>
				item.id === conversationItemId
					? ({ ...item, redPacketStatus: "accepted" } as TConversationItem)
					: item,
			),
		);
		sendRedPacketAcceptedReply(conversationItemId);
	};

	return (
		<canBeDetected.div
			className="flex flex-1 flex-col-reverse overflow-auto bg-[#F5F5F5] p-3"
			metaData={{
				type: EMetaDataType.ConversationList,
				index: conversationId,
				treeItemDisplayName: "聊天记录",
			}}
			innerRef={listRef}
			id="conversation-list"
		>
			<ReactSortable
				disabled={!isEdit}
				list={mappedSortableListData}
				animation={400}
				setList={(v, sortable) => {
					if (isEdit && sortable) {
						const needUpdate = v.some((_, i) => v[i].id !== conversationList[i].id);
						if (needUpdate) {
							setConversationList(v.map((i) => conversationList.find((d) => d.id === i.id)!));
						}
					}
				}}
				className="mb-auto space-y-4"
				onSort={() => {
					rebuildTree();
				}}
			>
				{conversationList.map((item) => {
					const operations: StaticMetaData.InjectMetaData["operations"] = [
						{
							onClick: handleOperationDelete.bind(null, item.id),
							element: <TopOperations.OperaionDeleteBase />,
						},
						{
							onClick: TopOperations.OperationSelectParent.selectParentNode,
							element: <TopOperations.OperationNewBase />,
						},
					];
					if (item.type === EConversationType.transfer && item.transferStatus === "awaiting") {
						operations.push({
							key: "transferReply",
							onClick: () => generateTransferReplyConversation(item.id),
							element: (
								<Tooltip title="回应转账消息">
									<SubnodeOutlined />
								</Tooltip>
							),
						});
					}
					if (item.type === EConversationType.redPacket && item.redPacketStatus === "awaiting") {
						operations.push({
							key: "RedPacketAcceptedReply",
							onClick: () => generateRedPacketAcceptedReplyConversation(item.id),
							element: (
								<Tooltip title="回应红包消息">
									<SubnodeOutlined />
								</Tooltip>
							),
						});
					}
					return (
						<canBeDetected.div
							className={twJoin(
								"group flex flex-col space-y-4",
								item.role,
								isEdit && "cursor-grab",
							)}
							key={item.id}
							metaData={[
								{
									type: EMetaDataType.ConversationItem,
									index: [conversationId, item.id],
									treeItemDisplayName: (data) =>
										`消息（${ConversationTypeLabel[data.type]}${
											data.role ? `-${data.role}` : ""
										}）`,
									operations,
									label: "单个消息",
								},
								{
									type: EMetaDataType.FirendProfile,
									index: conversationId,
									label: "好友个人信息",
								},
								{
									type: EMetaDataType.MyProfile,
									label: "个人信息",
								},
							]}
							nodeTreeSort
							data-conversation-id={item.id}
						>
							<ConversationItem data={item} />
						</canBeDetected.div>
					);
				})}
			</ReactSortable>
		</canBeDetected.div>
	);
};

export default ConversationList;
