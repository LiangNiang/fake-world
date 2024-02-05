import { exportDB } from 'dexie-export-import';
import { isUndefined } from 'lodash-es';

import { IDataSourceItem } from '@/state/globalConfig';

import { FakeWorldImageDB } from './dbInstance';
import { getAllStorageKey, getCurrentStorageKey, IMAGES_CACHE } from './utils';

export class DBManager {
  dbs: Record<IDataSourceItem['id'], FakeWorldImageDB> = {};
  static instance: DBManager | null = null;

  constructor() {
    const storageKeys = getAllStorageKey();
    for (const key of storageKeys) {
      const db = new FakeWorldImageDB(key);
      this.dbs[key] = db;
    }
  }

  getCurrentDBInstance() {
    const storageKey = getCurrentStorageKey();
    return this.dbs[storageKey];
  }

  getDBInstanceByKey(key: string) {
    return this.dbs[key];
  }

  createDBInstance(key: string) {
    if (this.dbs[key]) {
      return this.dbs[key];
    }
    const db = new FakeWorldImageDB(key);
    this.dbs[key] = db;
    return db;
  }

  static getInstace() {
    if (!this.instance) {
      this.instance = new DBManager();
    }
    return this.instance;
  }
}

export const db = DBManager.getInstace().getCurrentDBInstance();

export function initDBImagesCacheStore() {
  if (isUndefined(window.__INIT_IMAGE_DB_PROMISE__)) {
    console.time('initDBImagesCacheStore');
    window.__INIT_IMAGE_DB_PROMISE__ = db.images.toArray().then((allImages) => {
      allImages.forEach((v) => {
        if (!v.file) return;
        const url = URL.createObjectURL(v.file);
        IMAGES_CACHE.set(v.id, url);
      });
      console.timeEnd('initDBImagesCacheStore');
    });
  }
  return window.__INIT_IMAGE_DB_PROMISE__;
}

export function initDBBridge() {
  if (window.isOpenedByPuppeteer) {
    window.importDB = async function (dbFile: { data: number[] }) {
      const b = new Blob([new Uint8Array(dbFile.data)], { type: 'text/json' });
      return await db.import(b);
    };
  }
}

export async function exportDBById(id: IDataSourceItem['id']) {
  const db = DBManager.getInstace().getDBInstanceByKey(id);
  const imagesCount = await db.images.count();
  const isEmptyDB = imagesCount === 0;
  if (isEmptyDB) return null;
  return await exportDB(db);
}
