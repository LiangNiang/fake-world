import { h } from "@/components/HashAssets";
import TopOperations from "@/components/TopOperations";
import useModeNavigate from "@/components/useModeNavigate";
import { MYSELF_ID } from "@/faker/wechat/user";
import { EMetaDataType } from "@/stateV2/detectedNode";
import { dialogueListAtom } from "@/stateV2/dialogueList";
import { feedListAtom } from "@/stateV2/moments";
import { setAllProfilesValue } from "@/stateV2/profile";
import List from "@/wechatComponents/List";
import { Modal } from "antd";
import { useSetAtom } from "jotai";
import { memo } from "react";
import { twJoin } from "tailwind-merge";
import type { TRenderUser } from "../utils";

const UserItem = ({
	id,
	name,
	description,
	avatarInfo,
	_isLastInAnchorGroup,
	_key,
}: TRenderUser) => {
	const navigate = useModeNavigate();
	const setDialogueList = useSetAtom(dialogueListAtom);
	const setFeedList = useSetAtom(feedListAtom);
	const withDescription = !!description;

	const handleOperationDelete = () => {
		Modal.confirm({
			title: "是否删除该好友",
			content: "删除好友会同时删除与该好友的对话、该好友的朋友圈",
			onOk: () => {
				setAllProfilesValue((pv) => pv.filter((v) => v.id !== id));
				setDialogueList((pv) => pv.filter((v) => v.friendId !== id));
				setFeedList((pv) => pv.filter((v) => v.userId !== id));
			},
		});
	};

	return (
		<List.CanBeDetectedItem
			textPrev={
				<h.img src={avatarInfo} className="mr-3 h-9 w-9 rounded object-cover object-center" />
			}
			metaData={
				id === MYSELF_ID
					? { type: EMetaDataType.MyProfile, treeItemDisplayName: "我自己" }
					: {
							type: EMetaDataType.FirendProfile,
							index: id,
							treeItemDisplayName: () => `好友（${name}）`,
							operations: [
								{
									element: <TopOperations.OperaionDeleteBase />,
									onClick: handleOperationDelete,
								},
								{
									element: <TopOperations.OperationNewBase />,
									onClick: TopOperations.OperationSelectParent.selectParentNode,
								},
							],
						}
			}
			textPrevClassName="ml-0"
			key={_key}
			onClick={() => navigate(`/wechat/friend/${id}`)}
			className={twJoin("ml-4", _isLastInAnchorGroup && "border-black/5 border-b")}
			rightClassName={twJoin(withDescription && "py-0 pb-1", _isLastInAnchorGroup && "border-none")}
		>
			<div className="flex flex-col">
				<span>{name}</span>
				<span className="text-black/60 text-sm">{description}</span>
			</div>
		</List.CanBeDetectedItem>
	);
};

export default memo(UserItem);
