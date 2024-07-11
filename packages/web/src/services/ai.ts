import type { EConversationRole } from "@/state/conversationState";
import type { AxiosRequestConfig } from "axios";
import request, { type CommonJSONResponse } from "./request";

export async function generateChatMessage(props?: AxiosRequestConfig) {
	return request.get("/api/v1/ai/chat_message", props);
}
