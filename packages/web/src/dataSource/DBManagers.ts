import Dexie from 'dexie';
import { exportDB } from 'dexie-export-import';
import { isUndefined } from 'lodash-es';

import { ENV_SHARE_KEY } from '@/consts';
import { IDataSourceItem } from '@/state/globalConfig';

import { FakeWorldImageDB, getAllStorageKey, getCurrentStorageKey } from '.';

export class ImageDBManager {
  dbs: Record<IDataSourceItem['id'], FakeWorldImageDB> = {};
  static instance: ImageDBManager | null = null;
  static IMAGES_CACHE = new Map<string, string>();
  static __INIT_IMAGE_DB_PROMISE__: Promise<void> | undefined;

  constructor() {
    const storageKeys = getAllStorageKey();
    for (const key of storageKeys) {
      const db = new FakeWorldImageDB(key);
      this.dbs[key] = db;
    }
    this.dbs[ENV_SHARE_KEY] = new FakeWorldImageDB(ENV_SHARE_KEY);
    console.log(this.dbs);
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

  async exportDBById(id: IDataSourceItem['id']) {
    const db = this.getDBInstanceByKey(id);
    const imagesCount = await db.images.count();
    const isEmptyDB = imagesCount === 0;
    if (isEmptyDB) return null;
    return await exportDB(db);
  }

  async removeAllDBs() {
    const names = await Dexie.getDatabaseNames();
    for (const name of names) {
      await Dexie.delete(name);
    }
  }

  static getInstace() {
    if (!this.instance) {
      this.instance = new ImageDBManager();
    }
    return this.instance;
  }

  static async removeDBById(id: IDataSourceItem['id']) {
    await Dexie.delete(id);
  }

  static initDBImagesCacheStore() {
    if (isUndefined(ImageDBManager.__INIT_IMAGE_DB_PROMISE__)) {
      console.time('initDBImagesCacheStore');
      ImageDBManager.__INIT_IMAGE_DB_PROMISE__ = imageDB.images.toArray().then((allImages) => {
        allImages.forEach((v) => {
          if (!v.file) return;
          const url = URL.createObjectURL(v.file);
          ImageDBManager.IMAGES_CACHE.set(v.id, url);
        });
        console.timeEnd('initDBImagesCacheStore');
      });
    }
    return ImageDBManager.__INIT_IMAGE_DB_PROMISE__;
  }

  static initDBBridge() {
    if (window.isOpenedByPuppeteer) {
      window.importDB = async function (dbFile: { data: number[] }) {
        const b = new Blob([new Uint8Array(dbFile.data)], { type: 'text/json' });
        return await imageDB.import(b);
      };
    }
  }
}

export const imageDBManager = ImageDBManager.getInstace();

export const imageDB = imageDBManager.getCurrentDBInstance();
