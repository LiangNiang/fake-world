import { mkdir, unlink } from "node:fs/promises";

import { resolve } from "node:path";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { PrismaClient } from "@prisma/client";
import { generateObject } from "ai";
import { env } from "bun";
import { Elysia, NotFoundError, t } from "elysia";
import { rateLimit } from "elysia-rate-limit";
import { nanoid } from "nanoid";
import { z } from "zod";
import { openai } from "./provider";

const prisma = new PrismaClient();

const SRC_DIR = import.meta.dir;
const API_PROJECT_DIR = resolve(SRC_DIR, "..");
const STATIC_DB_DIR = resolve(API_PROJECT_DIR, "db");

await mkdir(STATIC_DB_DIR, { recursive: true });

const app = new Elysia()
	.use(
		cors({
			methods: ["POST", "GET", "DELETE"],
		}),
	)
	.use(
		staticPlugin({
			assets: STATIC_DB_DIR,
			prefix: "/public/db",
		}),
	)
	.get("/ping", () => "pong")
	.group("/api/v1", (app) =>
		app
			.get("/ping", () => "pong")
			.get("/share/:shareKey", async ({ params: { shareKey } }) => {
				const s = await prisma.shareInstance.findFirst({
					where: {
						shareKey,
					},
				});
				if (!s) throw new NotFoundError("Share Instance Not Found");
				return {
					data: {
						shareKey: s.shareKey,
						data: s.data,
						downloadUrl: s.downloadUrl,
					},
					message: "success",
					code: 0,
				};
			})
			.delete(
				"/share/:shareId",
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
						message: "success",
						code: 0,
					};
				},
				{
					error: ({ set }) => {
						set.status = 200;
						return {
							message: "success",
							code: 0,
						};
					},
				},
			)
			.post(
				"/share",
				async ({ body }) => {
					const { file, data } = body;
					let dbName: string | undefined;
					let downloadUrl: string | undefined;
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
						message: "success",
						code: 0,
					};
				},
				{
					type: "multipart/form-data",
					body: t.Object({
						data: t.ObjectString({}),
						file: t.Optional(t.File()),
					}),
				},
			)
			.group("/ai", (app) =>
				app
					.use(rateLimit({ max: 2 }))
					.get(
						"/profiles",
						async ({ query: { len } }) => {
							const { object } = await generateObject({
								mode: "auto",
								model: openai("gpt-3.5-turbo"),
								schema: z.object({
									profiles: z.array(
										z.object({
											nickname: z.string(),
											gender: z.enum(["female", "male"]),
											wechatId: z.string(),
											signature: z.string(),
											firstMoment: z.string(),
										}),
									),
								}),
								prompt: `给我随机生成${len}个用户资料，包括性别（gender: "male" | "female"）、昵称（nickname）、微信 id（wechatId）、朋友圈个性签名（signature）、一条文字朋友圈（firstMoment，不少于 40 字），要求尽量年轻现代化一点，语言为中文环境，但是也可以有英文、数字、emoji，严格贴近当今 90 后 00 后的 style，时尚潮流富有个性`,
							});
							return {
								data: object,
								code: 0,
								message: "success",
							};
						},
						{
							query: t.Object({
								len: t.Optional(t.Numeric({ maximum: 50, minimum: 1, default: 10 })),
							}),
						},
					)
					.get(
						"/chat_message",
						async ({ query: { remark } }) => {
							const { object } = await generateObject({
								mode: "auto",
								model: openai("gpt-3.5-turbo"),
								schema: z.object({
									messages: z.array(
										z.object({
											role: z.enum(["friend", "mine"]),
											content: z.string(),
										}),
									),
								}),
								prompt: `给我随机生成 20 句微信聊天记录，包括发送人（role, mine 是我自己，friend 是我的朋友，要求生成的角色符合语境以及上下文，例如不允许出现朋友称呼我为我给他的备注），发送的内容（content），每个人可以连续说几句都行，但不能只有一个人再说，要求尽量年轻现代化一点，语言为中文环境，但是也可以有英文、数字、emoji，严格贴近当今 90 后 00 后的 style，时尚潮流富有个性，聊天的整体主题小于等于 2 个，语境和主题符合${remark}`,
							});
							return {
								data: object,
								code: 0,
								message: "success",
							};
						},
						{
							query: t.Object({
								remark: t.Optional(t.String()),
							}),
						},
					),
			)
			.onError(async (err) => {
				console.log(err);
				return {
					code: -1,
				};
			}),
	)
	.onError(async ({ set }) => {
		await prisma.$disconnect();
		set.status = 500;
		return {
			code: -1,
			message: "Something went wrong. Please try again later.",
		};
	})
	.listen(env.PORT);

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
