import { atom, DefaultValue, selector } from 'recoil';

import { ENV_VERSION_KEY } from '@/consts';

import { globalConfigPersistAtom } from '../effects';

export interface IDataSourceItem {
  id: string;
  name?: string;
  type: 'local' | 'share';
  isCurrent: boolean;
  shareKey?: string;
  shareId?: string;
}

const INIT_DATASOURCE: IDataSourceItem = {
  id: ENV_VERSION_KEY ?? 'recoil-persist',
  name: '默认数据源',
  type: 'local',
  isCurrent: true,
};

export const INIT_DATASOURCE_LIST: IDataSourceItem[] = [INIT_DATASOURCE];

export const DATA_SOURCE_TYPE_LABEL = {
  local: '本地',
  share: '共享',
};

export const dataSourceListState = atom<IDataSourceItem[]>({
  key: 'dataSourceListState',
  default: INIT_DATASOURCE_LIST,
  effects_UNSTABLE: [globalConfigPersistAtom],
});

export const currentDataSourceState = selector<IDataSourceItem>({
  key: 'currentDataSourceState',
  get: ({ get }) => {
    const list = get(dataSourceListState);
    return list.find((item) => item.isCurrent) ?? list[0];
  },
  set: ({ set }, newValue) => {
    let v: IDataSourceItem;
    if (newValue instanceof DefaultValue) {
      v = INIT_DATASOURCE;
    } else {
      v = newValue;
    }
    set(dataSourceListState, (prev) => {
      return prev.map((item) => {
        if (item.id === v.id) {
          return v;
        } else {
          return item;
        }
      });
    });
  },
});
