import Dexie from "dexie";
import { isUndefined } from "lodash-es";
import { FakeWorldImageDB } from ".";

const __DB_NAME__ = "FakeWorldImageDB";

export class ImageDBManager {
	db: FakeWorldImageDB;
	static instance: ImageDBManager | null = null;
	static IMAGES_CACHE = new Map<string, string>();
	static __INIT_IMAGE_DB_PROMISE__: Promise<void> | undefined;

	constructor() {
		this.db = new FakeWorldImageDB(__DB_NAME__);
	}

	getCurrentDBInstance() {
		return this.db;
	}

	async removeDB() {
		await Dexie.delete(__DB_NAME__);
	}

	static getInstace() {
		if (!ImageDBManager.instance) {
			ImageDBManager.instance = new ImageDBManager();
		}
		return ImageDBManager.instance;
	}

	static initDBImagesCacheStore() {
		if (isUndefined(ImageDBManager.__INIT_IMAGE_DB_PROMISE__)) {
			console.time("initDBImagesCacheStore");
			ImageDBManager.__INIT_IMAGE_DB_PROMISE__ = imageDB.images.toArray().then((allImages) => {
				allImages.forEach((v) => {
					if (!v.file) return;
					const url = URL.createObjectURL(v.file);
					ImageDBManager.IMAGES_CACHE.set(v.id, url);
				});
				console.timeEnd("initDBImagesCacheStore");
			});
		}
		return ImageDBManager.__INIT_IMAGE_DB_PROMISE__;
	}
}

export const imageDBManager = ImageDBManager.getInstace();

export const imageDB = imageDBManager.getCurrentDBInstance();
