import { NOT_SHOW_ANCHOR, starS, TNeedGroupDataItem } from '@/state/profile';

type TRenderAnchor = {
  type: 'anchor';
  title: string | symbol;
  _key: string;
};

type TRenderUser = TNeedGroupDataItem & {
  type: 'user';
  _key: string;
  _isLastInAnchorGroup: boolean;
};

export type TRenderArrayItem = TRenderAnchor | TRenderUser;
export function groupedMapToRenderArray(data: Map<string | symbol, TNeedGroupDataItem[]>) {
  const result: TRenderArrayItem[] = [];
  data.forEach((v, i) => {
    if (v.length > 0 && !NOT_SHOW_ANCHOR.includes(i)) {
      result.push({
        type: 'anchor',
        title: i,
        _key: i.toString(),
      });
    }
    result.push(
      ...v.map((item, index) => {
        const isLast = index === v.length - 1;
        const k = i === starS ? `${starS.toString()}-${item.id}` : item.id;
        return { ...item, type: 'user', _key: k, _isLastInAnchorGroup: isLast } as TRenderUser;
      })
    );
  });
  return result;
}

export function findLastStuckKey(stuckInfo: Map<string, boolean>) {
  let lastTrueKey;
  for (const [k, v] of stuckInfo) {
    if (v) lastTrueKey = k;
  }
  return lastTrueKey;
}
