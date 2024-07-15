import type { DataNode } from "antd/es/tree";
import { atomWithRefresh } from "jotai/utils";
import { values } from "lodash-es";
import { mainStore } from "../store";
import { allNodesAtom } from "./nodeAtom";
import { debounceBuildTree } from "./utils";

export interface TreeNode extends DataNode {
	id: string;
	children: TreeNode[];
	parent?: TreeNode;
	nodeTreeSort: boolean;
}

export const allNodesTreeAtom = atomWithRefresh<Promise<TreeNode[]>>((get) => {
	const allNodes = get(allNodesAtom);
	return new Promise((resolve) => {
		debounceBuildTree(values(allNodes), resolve);
	});
});

export const getAllNodesTreeValueSnapshot = async () => await mainStore.get(allNodesTreeAtom);
