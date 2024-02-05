import { unlink } from 'node:fs/promises';

import { cors } from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';
import captureScreenshot from '@fake-world/capture';
import { PrismaClient } from '@prisma/client';
import { env } from 'bun';
import { Elysia, t } from 'elysia';
import { nanoid } from 'nanoid';
import { resolve } from 'path';

const prisma = new PrismaClient();

const app = new Elysia()
  .use(
    cors({
      methods: ['POST', 'GET', 'DELETE'],
    })
  )
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
          let db: Buffer | undefined;
          if (file !== undefined) {
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
            downloadUrl: s.dbName ? `/public/db/${s.dbName}` : null,
          },
          message: 'success',
          code: 0,
        };
      })
      .delete('/share/:id', async ({ params: { id } }) => {
        const s = await prisma.shareInstance.findUnique({
          where: {
            id,
          },
        });
        await prisma.shareInstance.delete({
          where: {
            id,
          },
        });
        if (s?.dbName) {
          await unlink(resolve(import.meta.dir, `../db/${s.dbName}`));
        }
        return {
          message: 'success',
          code: 0,
        };
      })
      .post(
        '/share',
        async ({ body }) => {
          const { file, data, name } = body;
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
              name,
            },
          });
          return {
            data: {
              id: s.id,
            },
            message: 'success',
            code: 0,
          };
        },
        {
          type: 'multipart/form-data',
          body: t.Object({
            data: t.ObjectString({}),
            file: t.Optional(t.File()),
            name: t.String({ maxLength: 128 }),
          }),
        }
      )
  )
  .onError(async ({ error, set }) => {
    console.error(error);
    await prisma.$disconnect();
    set.status = 400;
    return {
      code: -1,
      message: 'Something went wrong. Please try again later.',
    };
  })
  .listen(env.PORT);

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
