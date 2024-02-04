import Dexie, { Table } from 'dexie';

import { IMAGES_CACHE } from './utils';

export interface DBImage {
  id: string;
  file: File;
}

export class FakeWorldImageDB extends Dexie {
  images!: Table<DBImage>;

  constructor(name: string) {
    super(name);
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
