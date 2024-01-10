import Dexie, { Table } from 'dexie';
import { isUndefined } from 'lodash-es';

export interface DBImage {
  id: string;
  file: File;
}

export class FakeWorldDB extends Dexie {
  images!: Table<DBImage>;

  constructor() {
    super('fakeWorldDB');
    this.version(1).stores({
      images: '&id',
    });
    this.images.hook('creating', (_, obj) => {
      if (obj.file) {
        const url = URL.createObjectURL(obj.file);
        IMAGES_CACHE.set(obj.id, url);
      }
    });
  }
}

export const db = new FakeWorldDB();

export const IMAGES_CACHE = new Map<string, string>();

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
      console.log(dbFile);
      const b = new Blob([new Uint8Array(dbFile.data)], { type: 'text/json' });
      return await db.import(b);
    };
  }
}
