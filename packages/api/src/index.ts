import "./shim";
import { cors } from "@elysiajs/cors";
import { streamObject } from "ai";
import { env } from "bun";
import { Elysia, t } from "elysia";
import { rateLimit } from "elysia-rate-limit";
import { z } from "zod";
import { openai } from "./provider";

const app = new Elysia()
	.use(
		cors({
			methods: ["POST", "GET"],
			allowedHeaders: ["Content-Type"],
		}),
	)
	.get("/ping", () => "pong")
	.group("/api/v1", (app) =>
		app
			.group("/ai", (app) =>
				app.use(rateLimit({ max: 2 })).post(
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
				return {
					code: -1,
				};
			}),
	)
	.onError(async ({ set }) => {
		set.status = 500;
		return {
			code: -1,
			message: "Something went wrong. Please try again later.",
		};
	})
	.listen(env.PORT ?? 9000);

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
