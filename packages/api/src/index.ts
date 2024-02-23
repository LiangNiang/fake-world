import { mkdir, unlink } from 'node:fs/promises';

import { cors } from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';
import { PrismaClient } from '@prisma/client';
import { env } from 'bun';
import { Elysia, t } from 'elysia';
import { nanoid } from 'nanoid';
import { resolve } from 'path';

const prisma = new PrismaClient();

const SRC_DIR = import.meta.dir;
const API_PROJECT_DIR = resolve(SRC_DIR, '..');
const STATIC_DB_DIR = resolve(API_PROJECT_DIR, 'db');

await mkdir(STATIC_DB_DIR, { recursive: true });

const app = new Elysia()
  .use(
    cors({
      methods: ['POST', 'GET', 'DELETE'],
    })
  )
  .use(
    staticPlugin({
      assets: STATIC_DB_DIR,
      prefix: '/public/db',
    })
  )
  .get('/ping', () => 'pong')
  .group('/api/v1', (app) =>
    app
      .get('/share/:shareKey', async ({ params: { shareKey } }) => {
        const s = await prisma.shareInstance.findFirst({
          where: {
            shareKey,
          },
        });
        if (!s) throw new Error('Share Instance Not Found');
        return {
          data: {
            shareKey: s.shareKey,
            data: s.data,
            downloadUrl: s.downloadUrl,
          },
          message: 'success',
          code: 0,
        };
      })
      .delete(
        '/share/:shareId',
        async ({ params: { shareId } }) => {
          const s = await prisma.shareInstance.findUnique({
            where: {
              shareId,
            },
          });
          await prisma.shareInstance.delete({
            where: {
              shareId,
            },
          });
          if (s?.dbName) {
            await unlink(`${API_PROJECT_DIR}/db/${s.dbName}`);
          }
          return {
            message: 'success',
            code: 0,
          };
        },
        {
          error: ({ set }) => {
            set.status = 200;
            return {
              message: 'success',
              code: 10,
            };
          },
        }
      )
      .post(
        '/share',
        async ({ body }) => {
          const { file, data } = body;
          let dbName, downloadUrl;
          if (file !== undefined) {
            const fileId = nanoid();
            dbName = `${fileId}.db`;
            downloadUrl = `${env.API_URL}/public/db/${dbName}`;
            await Bun.write(`${API_PROJECT_DIR}/db/${dbName}`, file);
          }
          const shareKey = nanoid(5);
          const shareId = nanoid();
          await prisma.shareInstance.create({
            data: {
              data,
              dbName,
              downloadUrl,
              shareId,
              shareKey,
            },
          });
          return {
            data: {
              shareId,
              shareKey,
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
