import { cors } from '@elysiajs/cors';
import captureScreenshot from '@fake-world/capture';
import { env } from 'bun';
import { file as bunFile } from 'bun';
import { Elysia, t } from 'elysia';
import { resolve } from 'path';

const app = new Elysia()
  .use(cors())
  .post(
    '/api/screenshot',
    async ({ body, set }) => {
      const { file, data } = body;
      let db: Buffer;
      if (file === undefined) {
        db = Buffer.from(await bunFile(resolve(import.meta.dir, '../web.db')).arrayBuffer());
      } else {
        db = Buffer.from(await file.arrayBuffer());
      }
      const screenshot = await captureScreenshot({
        useNativeBrowser: env.USE_NATIVE_BROWSER === 'true',
        data,
        db,
        defaultHref: env.DEFAULT_HREF,
      });
      if (screenshot === undefined) {
        set.status = 500;
        return;
      }
      return new Blob([screenshot], { type: 'image/jpeg' });
    },
    {
      type: 'multipart/form-data',
      body: t.Object({
        data: t.ObjectString({}),
        file: t.Optional(t.File()),
      }),
    }
  )
  .get('/ping', () => 'pong')
  .listen(env.PORT);

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
