import { canBeDetected } from "@/components/NodeDetected";
import useMode from "@/components/useMode";
import { EMetaDataType } from "@/stateV2/detectedNode";
import { feedListAtom } from "@/stateV2/moments";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { ReactSortable } from "react-sortablejs";
import Feed from "./Feed";

const MomentsIndex = () => {
	const [feedList, setFeedList] = useAtom(feedListAtom);
	const { isEdit } = useMode();

	const mappedSortableListData = useMemo(() => {
		return feedList.map((v) => ({ id: v.id }));
	}, [feedList]);

	const feedClassNames = useMemo(() => {
		return {
			container: isEdit ? "cursor-grab" : "",
		};
	}, [isEdit]);

	return (
		<canBeDetected.div
			className="mt-12 flex flex-col"
			metaData={{
				type: EMetaDataType.AllFeeds,
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
						setFeedList(v.map((i) => feedList.find((d) => d.id === i.id)!));
					}
				}}
			>
				{feedList.map((feed) => (
					<Feed key={feed.id} id={feed.id} userId={feed.userId} classNames={feedClassNames} />
				))}
			</ReactSortable>
		</canBeDetected.div>
	);
};

export default MomentsIndex;
