import { NOT_SHOW_ANCHOR, TGroupedDataItem } from '@/state/profile';

export function groupedMapToRenderArray(data: Map<string | symbol, TGroupedDataItem[]>) {
  const result: (TGroupedDataItem | { type?: 'title'; title: string | symbol })[] = [];
  data.forEach((v, i) => {
    if (v.length > 0 && !NOT_SHOW_ANCHOR.includes(i)) {
      result.push({
        type: 'title',
        title: i,
      });
    }
    result.push(...v);
  });
  return result;
}
