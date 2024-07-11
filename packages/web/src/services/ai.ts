import type { AxiosRequestConfig } from "axios";
import request from "./request";

export async function generateChatMessage(props?: AxiosRequestConfig) {
	return request.get("/api/v1/ai/chat_message", props);
}
