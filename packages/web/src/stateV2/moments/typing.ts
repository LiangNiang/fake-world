import type { Descendant } from "slate";
import type { IStateProfile } from "../profile";

interface IFeedContentText {
	type: "text";
	text: Descendant[];
}

interface IFeedContentTextWithImages {
	type: "textWithImages";
	text?: Descendant[];
	imagesInfo: string[];
}

interface IFeedContentVideo {
	type: "video";
	text?: Descendant[];
	videoInfo: string;
}

type IFeedContent = IFeedContentText | IFeedContentTextWithImages | IFeedContentVideo;

export interface IFeedComment {
	id: string;
	text: Descendant[];
	replyUserId?: IStateProfile["id"];
	fromUserId: IStateProfile["id"];
	sendTimestamp: number;
}

export interface IStateFeed {
	id: string;
	userId: IStateProfile["id"];
	sendTimestamp: number;
	content: IFeedContent;
	likeUserIds?: IStateProfile["id"][];
	comments?: IFeedComment[];
}

export type TStateFeedLst = IStateFeed[];
