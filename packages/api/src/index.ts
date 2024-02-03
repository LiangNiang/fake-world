import { cors } from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';
import captureScreenshot from '@fake-world/capture';
import { PrismaClient } from '@prisma/client';
import { env } from 'bun';
import { file as bunFile } from 'bun';
import { Elysia, t } from 'elysia';
import { nanoid } from 'nanoid';
import { resolve } from 'path';

const prisma = new PrismaClient();

const app = new Elysia()
  .use(cors())
  .use(
    staticPlugin({
      assets: 'db',
      prefix: '/public/db',
    })
  )
  .get('/ping', () => 'pong')
  .group('/api/v1', (app) =>
    app
      .post(
        '/screenshot',
        async ({ body }) => {
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
            throw new Error('screenshot generation failed');
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
      .get('/share/:id', async ({ params: { id } }) => {
        const s = await prisma.shareInstance.findUnique({
          where: {
            id,
          },
        });
        if (!s) throw new Error('Share Instance Not Found');
        return {
          data: {
            ...s,
            downloadUrl: `/public/db/${s.dbName}`,
          },
        };
      })
      .post(
        '/share',
        async ({ body }) => {
          const { file, data } = body;
          let dbName;
          if (file !== undefined) {
            const fileId = nanoid();
            dbName = `${fileId}.db`;
            await Bun.write(resolve(import.meta.dir, `../db/${dbName}`), file);
          }
          const s = await prisma.shareInstance.create({
            data: {
              data,
              dbName,
            },
          });
          return {
            data: {
              id: s.id,
            },
            message: 'success',
            status: 0,
          };
        },
        {
          type: 'multipart/form-data',
          body: t.Object({
            data: t.ObjectString({}),
            file: t.Optional(t.File()),
          }),
        }
      )
  )
  .onError(async ({ error }) => {
    console.error(error);
    await prisma.$disconnect();
    return;
  })
  .listen(env.PORT);

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
