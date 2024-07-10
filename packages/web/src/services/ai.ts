import type { EConversationRole } from "@/state/conversationState";
import type { AxiosRequestConfig } from "axios";
import request, { type CommonJSONResponse } from "./request";

export async function generateChatMessage(remark?: string, signal?: AxiosRequestConfig["signal"]) {
	return request
		.get<CommonJSONResponse<{ messages: Array<{ role: EConversationRole; content: string }> }>>(
			"/api/v1/ai/chat_message",
			{
				params: {
					remark,
				},
				signal,
			},
		)
		.then((res) => res.data);
}
