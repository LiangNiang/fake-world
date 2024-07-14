import useMode from "@/components/useMode";
import {
	type TreeNode,
	activatedNodeAtom,
	allNodesTreeAtom,
	getNodeInjectMetaDataValueSnapshot,
} from "@/stateV2/detectedNode";
import { useSize } from "ahooks";
import { Tree } from "antd";
import { useAtomValue } from "jotai";
import { isArray } from "lodash-es";
import { memo, useEffect, useState } from "react";
import { doChangeOrder } from "../utils";
import NodeTreeTitle from "./Title";

const NodeTree = () => {
	const [currentSelected, setCurrentSelected] = useState<string>();
	const activatedNode = useAtomValue(activatedNodeAtom);
	const allNodeTree = useAtomValue(allNodesTreeAtom);
	const [expandKeys, setExpandKeys] = useState<string[]>([]);
	const size = useSize(document.querySelector("#tree-container"));
	const { isEdit, isPreview } = useMode();

	useEffect(() => {
		const res = [];
		for (const item of allNodeTree) {
			if (item.children.length > 0) {
				res.push(item.id);
			}
		}
		setExpandKeys(res);
	}, [allNodeTree]);

	useEffect(() => {
		if (activatedNode) {
			setCurrentSelected(activatedNode);
		}
	}, [activatedNode]);

	if (allNodeTree?.length === 0) {
		return null;
	}

	return (
		<Tree<TreeNode>
			treeData={allNodeTree}
			blockNode
			height={size?.height}
			expandedKeys={expandKeys}
			autoExpandParent
			onExpand={(expandedKeysValue) => setExpandKeys(expandedKeysValue as string[])}
			onSelect={(v) => {
				if (v.length === 1) {
					setCurrentSelected(v[0] as string);
					const element = document.getElementById(v[0] as string);
					element?.scrollIntoView({
						behavior: "smooth",
						block: "center",
					});
					if (isPreview) return;
					element?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
				}
			}}
			selectedKeys={[currentSelected as string]}
			titleRender={(item) => <NodeTreeTitle item={item} />}
			draggable={(node) => {
				return (node as TreeNode).nodeTreeSort && isEdit;
			}}
			onDrop={(info) => {
				const dropKey = info.node.key;
				/** 放置的节点是否是拖拽列表的直接子节点 */
				const isDropIsDirectChild = info.dragNode.parent?.key === info.node.parent?.key;
				const dragKey = info.dragNode.key;
				const dragMetaData = getNodeInjectMetaDataValueSnapshot(dragKey as string);
				const usedDragMetaData = isArray(dragMetaData) ? dragMetaData[0] : dragMetaData;
				doChangeOrder(
					dragKey as string,
					{
						toNodeId: dropKey as string,
						toFirst: !isDropIsDirectChild,
					},
					usedDragMetaData,
				);
			}}
			allowDrop={({ dropPosition, dropNode, dragNode }) => {
				if (dropNode.parent?.key !== dragNode.parent?.key && dropNode.key !== dragNode.parent?.key)
					return false;
				return dropPosition !== 0 || dropNode.children.length > 0;
			}}
		/>
	);
};

export default memo(NodeTree);
