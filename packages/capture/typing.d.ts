/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

interface Window {
  isOpenedByPuppeteer?: boolean;
  importDB: (db: Buffer) => Promise<void>;
}
