import CommentOutlinedSVG from "@/assets/comment-outlined.svg?react";
import { canBeDetected } from "@/components/NodeDetected";
import TopOperations from "@/components/TopOperations";
import useMode from "@/components/useMode";
import { EMetaDataType, allNodesTreeAtom } from "@/stateV2/detectedNode";
import { type IStateFeed, feedAtom } from "@/stateV2/moments";
import { useAtom, useSetAtom } from "jotai";
import { isEmpty } from "lodash-es";
import { useMemo } from "react";
import { ReactSortable } from "react-sortablejs";
import { twMerge } from "tailwind-merge";
import CommentItem from "./CommentItem";

type CommentsProps = {
	id: IStateFeed["id"];
	fromDetail?: boolean;
};

const Comments = ({ id, fromDetail }: CommentsProps) => {
	const [feed, setFeed] = useAtom(feedAtom(id));
	const { isEdit } = useMode();
	const rebuildTree = useSetAtom(allNodesTreeAtom);

	const { comments, likeUserIds } = feed ?? {};

	const mappedSortableListData = useMemo(() => {
		return comments?.map((v) => ({ id: v.id }));
	}, [comments]);

	if (isEmpty(comments)) return null;

	return (
		<>
			{!isEmpty(likeUserIds) && <div className="h-[1px] bg-black/5" />}
			<canBeDetected.div
				className={twMerge("p-[6px]", fromDetail && "flex p-2")}
				metaData={{
					type: EMetaDataType.FeedCommentsList,
					index: id,
					treeItemDisplayName: "评论",
					label: "新建评论",
					operations: [
						{
							onClick: TopOperations.OperationSelectParent.selectParentNode,
							element: <TopOperations.OperationSelectParent />,
						},
					],
				}}
			>
				{fromDetail && (
					<CommentOutlinedSVG
						fill="#465677"
						className="mt-2 mr-2 h-5 w-5 flex-shrink-0 origin-center scale-90"
					/>
				)}
				<ReactSortable
					className="flex flex-1 flex-col space-y-1"
					disabled={!isEdit}
					list={mappedSortableListData}
					animation={400}
					setList={(v, sortable) => {
						if (isEdit && sortable) {
							const needUpdate = v.some((_, i) => v[i].id !== comments![i].id);
							if (needUpdate) {
								setFeed((prev) => ({
									...prev,
									comments: v.map((i) => prev.comments!.find((d) => d.id === i.id)!),
								}));
							}
						}
					}}
					onSort={() => {
						rebuildTree();
					}}
				>
					{comments!.map((v) => (
						<CommentItem
							key={v.id}
							feedId={id}
							fromDetail={fromDetail}
							className={isEdit ? "cursor-grab" : ""}
							{...v}
						/>
					))}
				</ReactSortable>
			</canBeDetected.div>
		</>
	);
};

export default Comments;
