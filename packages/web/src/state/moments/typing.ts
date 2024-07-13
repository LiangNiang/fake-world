import type { IStateProfile } from "@/stateV2/profile";
import type { Descendant } from "slate";

export type TFeedContentType = "text" | "textWithImages" | "video" | "link";

export interface IFeedComment {
	id: string;
	text: Descendant[];
	replyUserId?: IStateProfile["id"];
	fromUserId: IStateProfile["id"];
	sendTimestamp: number;
}

export interface IFeedBase {
	id: string;
	userId: IStateProfile["id"];
	sendTimestamp: number;
}

export interface IFeed extends IFeedBase {
	content: IFeedContent;
	likeUserIds?: IStateProfile["id"][];
	comments?: IFeedComment[];
}

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
