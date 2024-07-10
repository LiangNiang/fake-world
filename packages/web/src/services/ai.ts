import type { EConversationRole } from "@/state/conversationState";
import request, { type CommonJSONResponse } from "./request";

export async function generateChatMessage(remark?: string) {
	return request
		.get<CommonJSONResponse<{ messages: Array<{ role: EConversationRole; content: string }> }>>(
			"/api/v1/ai/chat_message",
			{
				params: {
					remark,
				},
			},
		)
		.then((res) => res.data);
}
