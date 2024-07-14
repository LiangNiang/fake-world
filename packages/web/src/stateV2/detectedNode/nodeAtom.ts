import deepEqual from "fast-deep-equal";
import { type SetStateAction, atom } from "jotai";
import { focusAtom } from "jotai-optics";
import { atomFamily } from "jotai/utils";
import { isArray, isEmpty } from "lodash-es";
import type { OpticFor_ } from "optics-ts";
import { mainStore } from "../store";
import { nodeRuntimeDataAtom } from "./runtimeDataAtom";
import type { OverallMetaData, StaticMetaData } from "./typing";

export interface IStateNode {
	id: string;
	injectMetaData?: StaticMetaData.InjectMetaData | StaticMetaData.InjectMetaData[];
	freshData?: OverallMetaData.OverallData | OverallMetaData.OverallData[];
	nodeTreeSort: boolean;
}

type TStateAllNodes = {
	[key: string]: IStateNode;
};

/**
 * 所有的可探测节点集合
 */
export const allNodesAtom = atom<TStateAllNodes>({});

export const getAllNodesValueSnapshot = () => mainStore.get(allNodesAtom);
export const setAllNodesValue = (value: SetStateAction<TStateAllNodes>) =>
	mainStore.set(allNodesAtom, value);

/**
 * node 节点的 injectMetaData
 */
export const nodeInjectMetaDataAtom = atomFamily(
	(id: string) =>
		focusAtom(allNodesAtom, (optic) => optic.prop(id).optional().prop("injectMetaData")),
	deepEqual,
);

export const getNodeInjectMetaDataValueSnapshot = (id: string) =>
	mainStore.get(nodeInjectMetaDataAtom(id));

/**
 * hover 状态的节点
 */
export const hoveredNodeAtom = atom<string | null>(null);

/**
 * 激活的节点
 */
export const activatedNodeAtom = atom<string | null>(null);

export const getActivatedNodeValueSnapshot = () => mainStore.get(activatedNodeAtom);

export const setActivatedNodeValue = (id: string | null) => mainStore.set(activatedNodeAtom, id);

/**
 * node 实时数据
 */
export const nodeFreshDataAtom = atomFamily((id: IStateNode["id"]) => {
	return atom((get) => {
		const metaData = get(nodeInjectMetaDataAtom(id));
		if (isEmpty(metaData)) return undefined;
		if (isArray(metaData)) {
			return metaData.map((m) => get(nodeRuntimeDataAtom({ type: m.type, index: m.index })));
		}
		return get(nodeRuntimeDataAtom({ type: metaData.type, index: metaData.index }));
	});
}, deepEqual);

export const getNodeFreshDataValueSnapshot = (id: IStateNode["id"]) =>
	mainStore.get(nodeFreshDataAtom(id));

export const nodeAtom = atomFamily((id: IStateNode["id"]) => {
	const fa = focusAtom(allNodesAtom, (optic: OpticFor_<TStateAllNodes>) => optic.prop(id));
	return atom(
		(get) => ({
			...get(fa),
			freshData: get(nodeFreshDataAtom(id)),
		}),
		(_, set, newValue: SetStateAction<IStateNode>) => {
			set(fa, newValue);
		},
	);
});
