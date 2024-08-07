import {
	type StaticMetaData,
	type TreeNode,
	nodeFreshDataAtom,
	nodeInjectMetaDataAtom,
} from "@/stateV2/detectedNode";
import { useAtomValue } from "jotai";
import { isFunction, isNil, isString } from "lodash-es";
import { memo } from "react";
import { useTranslation } from "react-i18next";

const NodeTreeTitle = ({ item }: { item: TreeNode }) => {
	const { t } = useTranslation();
	const injectMetaData = useAtomValue(nodeInjectMetaDataAtom(item.id));
	const freshData = useAtomValue(nodeFreshDataAtom(item.id));

	if (!injectMetaData) return <div>{item.id}</div>;

	const renderTitleFunctional = (
		treeItemDisplayName: StaticMetaData.InjectMetaData["treeItemDisplayName"],
		freshDataIndex?: number,
	) => {
		if (isString(treeItemDisplayName)) return <div>{treeItemDisplayName}</div>;
		if (isFunction(treeItemDisplayName) && freshData !== undefined) {
			if (
				Array.isArray(freshData) &&
				freshDataIndex !== undefined &&
				!isNil(freshData[freshDataIndex])
			) {
				// @ts-ignore
				return <div>{treeItemDisplayName(freshData[freshDataIndex], t)}</div>;
			}
			// @ts-ignore
			return <div>{treeItemDisplayName(freshData, t)}</div>;
		}
		return <div>{item.id}</div>;
	};

	if (Array.isArray(injectMetaData)) {
		const hasTreeItemDisplayNameIndex = injectMetaData.findIndex((v) => !!v.treeItemDisplayName);
		if (hasTreeItemDisplayNameIndex === -1) return <div>{item.id}</div>;
		return renderTitleFunctional(
			injectMetaData[hasTreeItemDisplayNameIndex].treeItemDisplayName,
			hasTreeItemDisplayNameIndex,
		);
	}
	return injectMetaData.treeItemDisplayName ? (
		renderTitleFunctional(injectMetaData.treeItemDisplayName)
	) : (
		<div>{item.id}</div>
	);
};

export default memo(NodeTreeTitle);
