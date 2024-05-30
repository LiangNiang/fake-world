import { isArray } from "lodash-es";

import { ENV_GLOBAL_KEY, ENV_SHARE_KEY, ENV_VERSION_KEY } from "@/consts";

export function getCurrentStorageKey() {
	if (window.__SHARE_KEY__) {
		return ENV_SHARE_KEY ?? ENV_VERSION_KEY ?? "recoil-persist";
	}
	const globalConfig = localStorage.getItem(ENV_GLOBAL_KEY);
	if (globalConfig) {
		try {
			const config = JSON.parse(globalConfig);
			if (config.dataSourceListState && isArray(config.dataSourceListState)) {
				const curDataSource = config.dataSourceListState.find((v: any) => v.isCurrent);
				if (curDataSource) {
					return curDataSource.id;
				}
			}
		} catch {}
	}
	return ENV_VERSION_KEY ?? "recoil-persist";
}

export function getAllStorageKey() {
	const globalConfig = localStorage.getItem(ENV_GLOBAL_KEY);
	if (globalConfig) {
		try {
			const config = JSON.parse(globalConfig);
			if (config.dataSourceListState && isArray(config.dataSourceListState)) {
				return config.dataSourceListState.map((v: any) => v.id);
			}
		} catch {}
	}
	return [ENV_VERSION_KEY ?? "recoil-persist"];
}
