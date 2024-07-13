import getFakerInstanceByLang from "@/faker/core";
import type { IStateFeed } from "@/stateV2/moments";
import type { IStateProfile } from "@/stateV2/profile";
import dayjs from "dayjs";
import { nanoid } from "nanoid";

export function randomFeedId() {
	return nanoid(8);
}

export function randomFeedCommentId() {
	return nanoid(8);
}

export function randomFeedImage(num = 1) {
	const faker = getFakerInstanceByLang();
	return Array.from({ length: num }).map(() => faker.image.url());
}

export function generateFakeFeed(userId: IStateProfile["id"]): IStateFeed {
	return {
		id: randomFeedId(),
		sendTimestamp: dayjs().valueOf(),
		content: {
			type: "textWithImages",
			imagesInfo: randomFeedImage(3),
		},
		userId,
	};
}
