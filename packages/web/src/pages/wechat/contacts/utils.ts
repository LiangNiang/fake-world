import { NOT_SHOW_ANCHOR, type TNeedGroupDataItem, starS } from "@/stateV2/profile";

type TRenderAnchor = {
	type: "anchor";
	title: string | symbol;
	_key: string;
};

export type TRenderUser = TNeedGroupDataItem & {
	type: "user";
	_key: string;
	_isLastInAnchorGroup: boolean;
};

export function getStuckInfo(anchorData: Map<string | symbol, TNeedGroupDataItem[]>) {
	const newMap = new Map();
	anchorData.forEach((_, k) => newMap.set(k.toString(), false));
	return newMap;
}

export type TRenderArrayItem = TRenderAnchor | TRenderUser;
export function groupedMapToRenderArray(data: Map<string | symbol, TNeedGroupDataItem[]>) {
	const result: TRenderArrayItem[] = [];
	data.forEach((v, i) => {
		if (v.length > 0 && !NOT_SHOW_ANCHOR.includes(i)) {
			result.push({
				type: "anchor",
				title: i,
				_key: i.toString(),
			});
		}
		result.push(
			...v.map((item, index) => {
				const isLast = index === v.length - 1;
				const k = i === starS ? `${starS.toString()}-${item.id}` : item.id;
				return { ...item, type: "user", _key: k, _isLastInAnchorGroup: isLast } as TRenderUser;
			}),
		);
	});
	return result;
}

export function findLastStuckKey(stuckInfo: Map<string, boolean>) {
	let lastTrueKey: string | undefined;
	for (const [k, v] of stuckInfo) {
		if (v) lastTrueKey = k;
	}
	return lastTrueKey;
}

export function isBefore(map: Map<string, any>, k1: string, k2: string) {
	for (const key of map.keys()) {
		if (key === k1) {
			return true;
		}
		if (key === k2) {
			return false;
		}
	}
	return false;
}
