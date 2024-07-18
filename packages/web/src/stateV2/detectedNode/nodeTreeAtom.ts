import type { DataNode } from "antd/es/tree";
import { atomWithRefresh } from "jotai/utils";
import { keys } from "lodash-es";
import { mainStore } from "../store";
import { type IStateNode, getNodeValueSnapshot, nodesAtomsAtom } from "./nodeAtom";
import { debounceBuildTree } from "./utils";

export interface TreeNode extends DataNode {
	id: string;
	children: TreeNode[];
	parent?: TreeNode;
	nodeTreeSort: boolean;
}

export const allNodesTreeAtom = atomWithRefresh<Promise<TreeNode[]>>((get) => {
	const allNodes = get(nodesAtomsAtom);
	return new Promise((resolve) => {
		debounceBuildTree(
			keys(allNodes)
				.map((v) => getNodeValueSnapshot(v))
				.filter(Boolean) as IStateNode[],
			resolve,
		);
	});
});

export const getAllNodesTreeValueSnapshot = async () => await mainStore.get(allNodesTreeAtom);
