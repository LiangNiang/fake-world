import { canBeDetected } from "@/components/NodeDetected";
import TopOperations from "@/components/TopOperations";
import useModeNavigate from "@/components/useModeNavigate";
import { generateInitFeedComment } from "@/faker/wechat/moments";
import { MYSELF_ID } from "@/faker/wechat/user";
import { EMetaDataType } from "@/stateV2/detectedNode";
import { type IStateFeed, feedAtom, feedListAtom } from "@/stateV2/moments";
import { profileAtom } from "@/stateV2/profile";
import UserAvatar from "@/wechatComponents/User/UserAvatar";
import { CommentOutlined, SelectOutlined, UserOutlined } from "@ant-design/icons";
import { Modal, Tooltip } from "antd";
import { useAtomValue, useSetAtom } from "jotai";
import { memo, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { twJoin, twMerge } from "tailwind-merge";
import Comments from "./Comments";
import FeedContent from "./Content";
import LikeList from "./Likes";

type Props = {
	classNames?: Partial<{
		container: string;
		avatar: string;
		likeAndComments: string;
	}>;
	fromDetail?: boolean;
};

const Feed = ({
	id,
	userId,
	classNames,
	fromDetail,
}: Omit<IStateFeed, "sendTimestamp" | "content"> & Props) => {
	const { nickname, remark } = useAtomValue(profileAtom(userId))!;
	const setFeedList = useSetAtom(feedListAtom);
	const setFeed = useSetAtom(feedAtom(id));
	const originalNavigate = useNavigate();
	const navigate = useModeNavigate({ silence: true });

	const likeAndCommentsContent = useMemo(() => {
		return (
			<div
				className={twMerge("mt-2 flex flex-col rounded bg-wechatBG-3", classNames?.likeAndComments)}
			>
				<LikeList id={id} fromDetail={fromDetail} />
				<Comments id={id} fromDetail={fromDetail} />
			</div>
		);
	}, []);

	const handleOperationDelete = () => {
		Modal.confirm({
			title: "是否删除该条朋友圈？",
			onOk: () => {
				setFeedList((v) => v.filter((v) => v.id !== id));
			},
		});
	};

	const toFriendPage = useCallback(() => {
		navigate(`/wechat/friend/${userId}`);
	}, [userId]);

	let operations = [
		{
			key: "delete",
			onClick: handleOperationDelete,
			element: <TopOperations.OperaionDeleteBase />,
		},
		{
			key: "new",
			onClick: TopOperations.OperationSelectParent.selectParentNode,
			element: <TopOperations.OperationNewBase tooltipProps={{ title: "新增朋友圈" }} />,
		},
		{
			onClick: () => {
				setFeed((prev) => ({
					...prev,
					comments: [...(prev.comments ?? []), generateInitFeedComment()],
				}));
			},
			element: (
				<Tooltip title="新增评论">
					<CommentOutlined />
				</Tooltip>
			),
		},
		{
			onClick: () => {
				originalNavigate(`/wechat/moments/user/${userId}`);
			},
			element: (
				<Tooltip title="进入到该用户的单独朋友圈页面">
					<UserOutlined />
				</Tooltip>
			),
		},
		{
			key: "detail",
			onClick: () => {
				originalNavigate(`/wechat/moments/${id}`);
			},
			element: (
				<Tooltip title="进入到单条朋友圈的详情页">
					<SelectOutlined />
				</Tooltip>
			),
		},
	];

	if (fromDetail) {
		operations = operations.filter((v) => !["new", "delete", "detail"].includes(v.key ?? ""));
	}

	return (
		<canBeDetected.div
			className={twMerge("flex flex-col border-black/5 border-b px-5 py-3", classNames?.container)}
			metaData={[
				{
					type: EMetaDataType.MomentsFeed,
					index: id,
					operations,
					label: "朋友圈",
				},
				userId === MYSELF_ID
					? {
							type: EMetaDataType.MyProfile,
							treeItemDisplayName: (data) => `${data.nickname}的朋友圈`,
							label: "用户信息",
						}
					: {
							type: EMetaDataType.FirendProfile,
							index: userId,
							treeItemDisplayName: (data) => `${data.nickname}的朋友圈`,
							label: "用户信息",
						},
			]}
			nodeTreeSort
		>
			<div className="flex">
				<UserAvatar
					id={userId}
					size="middle"
					className={twJoin("cursor-pointer", classNames?.avatar)}
					onClick={toFriendPage}
				/>
				<div className="ml-3 flex flex-1 flex-col overflow-hidden">
					<span className="cursor-pointer self-start text-wechatLink-1" onClick={toFriendPage}>
						{remark ?? nickname}
					</span>
					<FeedContent id={id} fromDetail={fromDetail} />
					{!fromDetail && likeAndCommentsContent}
				</div>
			</div>
			{fromDetail && likeAndCommentsContent}
		</canBeDetected.div>
	);
};

export default memo(Feed);
