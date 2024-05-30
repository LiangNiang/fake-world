import type { IFeedComment } from "@/state/moments";

import { DEFAULT_FEED_COMMENT } from "./consts";
import { randomFeedCommentId } from "./generator";

export function generateInitFeedComment(): IFeedComment {
	return {
		id: randomFeedCommentId(),
		...DEFAULT_FEED_COMMENT,
	};
}
