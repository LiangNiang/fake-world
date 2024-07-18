import dayjs from "dayjs";
import type { TConversationItem } from "./typing";

export const fromLastGenerateUpperText = (list: TConversationItem[]) => {
	const last = list[list.length - 1];
	let upperText: undefined | string;
	if (!last || !last.sendTimestamp) upperText = dayjs().format("HH:mm");
	if (last?.sendTimestamp && dayjs().diff(last.sendTimestamp, "minute") >= 4) {
		upperText = dayjs().format("HH:mm");
	}
	return upperText;
};
