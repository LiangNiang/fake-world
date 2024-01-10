import { exists, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

import { env, file, write } from 'bun';

export const isDevelopment = env.NODE_ENV === 'development';

export const isProduction = env.NODE_ENV === 'production';

export async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function loadDB(dbPath: string) {
  const path = resolve(__dirname, dbPath);
  return Buffer.from(await file(path).arrayBuffer());
}

export async function saveFile(dir: string, fileName: string, buffer: Buffer) {
  const totalPath = resolve(dir, fileName);
  if (!(await exists(dir))) {
    await mkdir(dir);
  }
  await write(totalPath, buffer);
  return totalPath;
}
