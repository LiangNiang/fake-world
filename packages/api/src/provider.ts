import { createOpenAI } from "@ai-sdk/openai";
import { env } from "bun";

export const openai = createOpenAI({
	baseURL: env.OPENAI_baseURL,
	apiKey: env.OPENAI_apiKey,
	compatibility: "compatible",
});
