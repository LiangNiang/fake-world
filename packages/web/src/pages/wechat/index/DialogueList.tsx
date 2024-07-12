import { canBeDetected } from "@/components/NodeDetected";
import useMode from "@/components/useMode";
import { MetaDataType, allNodesTreeState } from "@/state/detectedNode";
import { dialogueListAtom, dialogueListEffect } from "@/stateV2/dialogueList";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { ReactSortable } from "react-sortablejs";
import { useResetRecoilState } from "recoil";
import DialogueItem from "./DialogueItem";

const DialogueList = () => {
	const { isEdit } = useMode();
	const [dialogueList, setDialogueList] = useAtom(dialogueListAtom);
	const resetTree = useResetRecoilState(allNodesTreeState);
	useAtom(dialogueListEffect);

	const mappedSortableListData = useMemo(() => {
		return dialogueList.map((item) => ({
			id: item.id,
		}));
	}, [dialogueList]);

	return (
		<canBeDetected.section
			metaData={{
				type: MetaDataType.DialogueList,
				treeItemDisplayName: "对话列表",
				label: "从好友列表快速新建对话项",
			}}
			className="flex-1"
		>
			<ReactSortable
				disabled={!isEdit}
				list={mappedSortableListData}
				animation={400}
				setList={(v, sortable) => {
					if (isEdit && sortable) {
						const needUpdate = v.some((_, i) => v[i].id !== dialogueList[i].id);
						if (needUpdate) {
							setDialogueList(
								v.map((i) => {
									return dialogueList.find((d) => d.id === i.id)!;
								}),
							);
						}
					}
				}}
				onSort={() => {
					setTimeout(() => {
						resetTree();
					});
				}}
			>
				{dialogueList.map((item) => (
					<DialogueItem itemId={item.id} key={item.id} className={isEdit ? "cursor-grab" : ""} />
				))}
			</ReactSortable>
		</canBeDetected.section>
	);
};

export default DialogueList;
