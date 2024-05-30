import { values } from "lodash-es";
import { DefaultValue, atom, selector } from "recoil";

import { sleep } from "@/utils";

import { allNodesState } from ".";
import { type TreeNode, buildTree } from "./utils";

export const flag2State = atom({
	key: "flag2State",
	default: false,
});

/** allNodesState 派生为树结构 */
export const allNodesTreeState = selector<TreeNode[]>({
	key: "allNodesTreeState",
	get: async ({ get }) => {
		const flag2 = get(flag2State);
		if (flag2) {
			const allNodes = get(allNodesState);
			return await buildTree(values(allNodes));
		}
		await sleep(9999999999);
		return await buildTree([]);
	},
	set: ({ set }, newValue) => {
		if (newValue instanceof DefaultValue) {
			set(allNodesState, (pv) => ({
				...pv,
			}));
		}
	},
});
