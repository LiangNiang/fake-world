import { useMemo } from "react";
import { ReactSortable } from "react-sortablejs";
import { useRecoilState, useResetRecoilState } from "recoil";

import { canBeDetected } from "@/components/NodeDetected";
import useMode from "@/components/useMode";
import { MetaDataType, allNodesTreeState } from "@/state/detectedNode";
import { allFeedsState } from "@/state/moments";

import Feed from "./Feed";

const MomentsIndex = () => {
	const [allFeeds, setAllFeeds] = useRecoilState(allFeedsState);
	const { isEdit } = useMode();
	const resetTree = useResetRecoilState(allNodesTreeState);

	const mappedSortableListData = useMemo(() => {
		return allFeeds.map((v) => ({ id: v.id }));
	}, [allFeeds]);

	const feedClassNames = useMemo(() => {
		return {
			container: isEdit ? "cursor-grab" : "",
		};
	}, [isEdit]);

	return (
		<canBeDetected.div
			className="mt-12 flex flex-col"
			metaData={{
				type: MetaDataType.AllFeeds,
				treeItemDisplayName: "所有朋友圈",
				label: "新增朋友圈",
			}}
		>
			<ReactSortable
				disabled={!isEdit}
				list={mappedSortableListData}
				animation={400}
				setList={(v, sortable) => {
					if (isEdit && sortable) {
						setAllFeeds(v.map((i) => allFeeds.find((d) => d.id === i.id)!));
					}
				}}
				onSort={() => {
					setTimeout(() => {
						resetTree();
					});
				}}
			>
				{allFeeds.map((feed) => (
					<Feed key={feed.id} id={feed.id} userId={feed.userId} classNames={feedClassNames} />
				))}
			</ReactSortable>
		</canBeDetected.div>
	);
};

export default MomentsIndex;
