import { sleep } from "@/utils";
import type { DataNode } from "antd/es/tree";
import { type SetStateAction, atom } from "jotai";
import { values } from "lodash-es";
import { mainStore } from "../store";
import { allNodesAtom } from "./nodeAtom";
import { buildTree } from "./utils";

export const treeFlagAtom = atom(false);

export const setTreeFlagAtom = (value: SetStateAction<boolean>) =>
	mainStore.set(treeFlagAtom, value);

export interface TreeNode extends DataNode {
	id: string;
	children: TreeNode[];
	parent?: TreeNode;
	nodeTreeSort: boolean;
}

export const allNodesTreeAtom = atom(async (get) => {
	const flag = get(treeFlagAtom);
	if (flag) {
		const allNodes = get(allNodesAtom);
		return await buildTree(values(allNodes));
	}
	await sleep(99999999);
	return await buildTree([]);
});

export const getAllNodesTreeValueSnapshot = async () => await mainStore.get(allNodesTreeAtom);
