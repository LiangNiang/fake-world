import { useUpdate } from 'ahooks';
import { useEffect } from 'react';

import { ImageDBManager } from '@/dataSource';

export function useAsyncAssetsCache(run?: boolean) {
  const update = useUpdate();

  useEffect(() => {
    if (run) {
      ImageDBManager.initDBImagesCacheStore().then(() => {
        run && update();
      });
    }
  }, [run]);
}
