import { isArray } from 'lodash-es';

export function getCurrentStorageKey() {
  if (window.__SHARE_KEY__) {
    return import.meta.env.VITE_PERSIST_STATE_SHARE_KEY ?? import.meta.env.VITE_PERSIST_STATE_VERSION_KEY ?? 'recoil-persist';
  }
  const globalConfig = localStorage.getItem(import.meta.env.VITE_PERSIST_STATE_GLOBAL_KEY);
  if (globalConfig) {
    try {
      const config = JSON.parse(globalConfig);
      if (config.dataSourceListState && isArray(config.dataSourceListState)) {
        const curDataSource = config.dataSourceListState.find((v: any) => v.isCurrent);
        if (curDataSource) {
          return curDataSource.id;
        }
      }
      // eslint-disable-next-line no-empty
    } catch {}
  }
  return import.meta.env.VITE_PERSIST_STATE_VERSION_KEY ?? 'recoil-persist';
}

export function getAllStorageKey() {
  const globalConfig = localStorage.getItem(import.meta.env.VITE_PERSIST_STATE_GLOBAL_KEY);
  if (globalConfig) {
    try {
      const config = JSON.parse(globalConfig);
      if (config.dataSourceListState && isArray(config.dataSourceListState)) {
        return config.dataSourceListState.map((v: any) => v.id);
      }
      // eslint-disable-next-line no-empty
    } catch {}
  }
  return [import.meta.env.VITE_PERSIST_STATE_VERSION_KEY ?? 'recoil-persist'];
}
