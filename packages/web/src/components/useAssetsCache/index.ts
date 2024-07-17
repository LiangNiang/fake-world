import { initDBImagesCacheStore } from "@/db";
import { useUpdate } from "ahooks";
import { useEffect } from "react";

export function useAsyncAssetsCache(run?: boolean) {
	const update = useUpdate();

	useEffect(() => {
		if (run) {
			initDBImagesCacheStore().then(() => {
				run && update();
			});
		}
	}, [run]);
}
