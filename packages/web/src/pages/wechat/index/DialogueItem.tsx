import MUTED_SVG from "@/assets/muted.svg";
import Badge from "@/components/Badge";
import { h } from "@/components/HashAssets";
import { canBeDetected } from "@/components/NodeDetected";
import TopOperations from "@/components/TopOperations";
import { MetaDataType } from "@/state/detectedNode";
import { friendState } from "@/state/profile";
import { type IDialogueItem, dialogueItemAtom, dialogueListAtom } from "@/stateV2/dialogueList";
import { Modal } from "antd";
import { useAtomValue, useSetAtom } from "jotai";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { twMerge } from "tailwind-merge";
import styles from "./style.module.scss";

type Props = {
	itemId: IDialogueItem["id"];
	className?: string;
};

const DialogueItem = ({ itemId, className }: Props) => {
	const {
		friendId,
		id,
		isPinned,
		unreadDisplayType,
		unreadMarkNumber,
		isMuted,
		badgeHide,
		lastMessage,
		lastMessageTime,
	} = useAtomValue(dialogueItemAtom(itemId))!;
	const friendProfile = useRecoilValue(friendState(friendId));
	const setDialogueList = useSetAtom(dialogueListAtom);
	const navigate = useNavigate();

	const { nickname, avatarInfo, remark } = friendProfile;

	const handleOperationDelete = () => {
		Modal.confirm({
			title: "是否删除该对话项？",
			onOk: () => {
				setDialogueList((prev) => prev.filter((v) => v.id !== id));
			},
		});
	};

	return (
		<canBeDetected.div
			className={twMerge(
				"relative flex cursor-pointer items-center p-4 after:absolute after:bottom-0 after:w-full after:border-gray-200 after:border-b",
				styles["chat-item"],
				isPinned && "bg-[rgba(237,237,237,1)]",
				className,
			)}
			metaData={[
				{
					type: MetaDataType.DialogueItem,
					index: id,
					operations: [
						{ onClick: handleOperationDelete, element: <TopOperations.OperaionDeleteBase /> },
						{
							onClick: TopOperations.OperationSelectParent.selectParentNode,
							element: <TopOperations.OperationNewBase />,
						},
					],
					label: "对话项目",
				},
				{
					type: MetaDataType.FirendProfile,
					index: friendId,
					label: "好友个人信息",
					treeItemDisplayName: (data) => `对话项目（${data.nickname}）`,
				},
			]}
			onClick={() => {
				navigate(`/wechat/conversation/${friendId}`);
			}}
			nodeTreeSort
		>
			<Badge type={unreadDisplayType} text={unreadMarkNumber} hidden={badgeHide}>
				<h.img className="h-10 w-10 rounded-[4px] object-cover object-center" src={avatarInfo} />
			</Badge>
			<div className="ml-3 flex flex-1 flex-col space-y-1 overflow-hidden">
				<div className="flex items-center justify-between">
					<span className="font-normal">{remark ?? nickname}</span>
					<span className="text-gray-400 text-xs">{lastMessageTime}</span>
				</div>
				<div className="flex items-center">
					<span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-gray-400 text-sm">
						{lastMessage}
					</span>
					{isMuted && <img className="w-4" src={MUTED_SVG} />}
				</div>
			</div>
		</canBeDetected.div>
	);
};

export default memo(DialogueItem);
