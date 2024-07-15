import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { PrismaClient } from "@prisma/client";
import { generateObject, streamObject } from "ai";
import { env } from "bun";
import { Elysia, t } from "elysia";
import { rateLimit } from "elysia-rate-limit";
import { z } from "zod";
import "./shim";
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
			allowedHeaders: ["Content-Type"],
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
			.group("/ai", (app) =>
				app
					.use(rateLimit({ max: 2 }))
					.post(
						"/profiles",
						async ({ body: { len } }) => {
							const { object } = await generateObject({
								mode: "auto",
								model: openai(env.OPENAI_model ?? "gpt-3.5-turbo"),
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
								prompt: `给我随机生成${len}个用户资料,包括性别(gender:"male"|"female")、昵称(nickname)、微信id(wechatId)、朋友圈个性签名(signature)、一条文字朋友圈(firstMoment,不少于 40 字),要求风格贴近当今年轻人的style,时尚潮流富有个性,语言为中文环境,但是也可以有英文、数字、emoji`,
								maxRetries: 5,
							});
							return {
								data: object,
								code: 0,
								message: "success",
							};
						},
						{
							body: t.Object({
								len: t.Optional(t.Numeric({ maximum: 20, minimum: 1, default: 10 })),
							}),
						},
					)
					.post(
						"/chat_message",
						async ({ body: { remark, topic } }) => {
							const res = await streamObject({
								mode: "auto",
								model: openai(env.OPENAI_model ?? "gpt-3.5-turbo"),
								schema: z.object({
									messages: z.array(
										z.object({
											role: z.enum(["mine", "friend"]),
											content: z.string(),
										}),
									),
								}),
								prompt: `给我随机生成20多句微信聊天记录,包括发送人(role,有如下两个枚举值:mine是我自己,friend是我的朋友,关于friend的信息是:${remark}),发送的内容(content,要求内容符合发送人以及当前上下文语境,单个角色可以连续说几句,不用一个角色下面紧接着另一个角色,但总体不能只有一个角色在说),要求语言风格贴近当今年轻人的style,语言为中文环境,但是也可以有英文、数字、emoji,聊天的整体主题是${topic}`,
								maxRetries: 5,
								temperature: 0.8,
							});
							return res.toTextStreamResponse();
						},
						{
							body: t.Object({
								remark: t.String(),
								topic: t.String(),
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
