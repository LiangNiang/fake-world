import { dequal } from "dequal/lite";
import { type PrimitiveAtom, atom } from "jotai";
import { atomFamily, selectAtom } from "jotai/utils";
import { isArray, isEmpty, isUndefined } from "lodash-es";
import { mainStore } from "../store";
import handlerMap from "./handlerMap";
import type { OverallMetaData, StaticMetaData } from "./typing";

export interface IStateNode {
	id: string;
	injectMetaData?: StaticMetaData.InjectMetaData | StaticMetaData.InjectMetaData[];
	freshData?: OverallMetaData.OverallData | OverallMetaData.OverallData[];
	nodeTreeSort: boolean;
}

type TStateNodesAtoms = {
	[ksy: string]: PrimitiveAtom<IStateNode>;
};

const atomUndefined = atom(undefined);

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

export const nodesAtomsAtom = atom<TStateNodesAtoms>({});

export const getNodesAtomsValueSnapshot = () => mainStore.get(nodesAtomsAtom);

export const nodeAtom = atomFamily((id: IStateNode["id"]) => {
	return atom((get) => {
		const nodesAtoms = get(nodesAtomsAtom);
		const targetAtom = nodesAtoms[id];
		return targetAtom ? get(targetAtom) : undefined;
	});
}, dequal);

export const getNodeValueSnapshot = (id: IStateNode["id"]) => mainStore.get(nodeAtom(id));

export const nodeInjectMetaDataAtom = atomFamily((id: IStateNode["id"]) => {
	if (isEmpty(id)) return atomUndefined;
	return selectAtom(nodeAtom(id), (node) => node?.injectMetaData, dequal);
}, dequal);

export const getNodeInjectMetaDataValueSnapshot = (id: string) =>
	mainStore.get(nodeInjectMetaDataAtom(id));

export const nodeFreshDataAtom = atomFamily((id: IStateNode["id"]) => {
	if (isEmpty(id)) return atomUndefined;
	return atom((get) => {
		function getFreshData(type: OverallMetaData.OverallType, index: OverallMetaData.OverallIndex) {
			const handler = handlerMap[type!];
			if (isUndefined(handler)) return undefined;
			return handler(get, index);
		}
		const metaData = get(nodeInjectMetaDataAtom(id));
		if (isEmpty(metaData)) return undefined;
		if (isArray(metaData)) {
			return metaData.map((m) => getFreshData(m.type, m.index));
		}
		return getFreshData(metaData.type, metaData.index);
	});
}, dequal);

export const getNodeFreshDataValueSnapshot = (id: IStateNode["id"]) =>
	mainStore.get(nodeFreshDataAtom(id));
