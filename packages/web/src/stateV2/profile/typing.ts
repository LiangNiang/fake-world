export interface IStateProfile {
	id: string;
	/** 昵称 */
	nickname: string;
	/** 备注 */
	remark?: string;
	avatarInfo: string;
	/** 朋友圈背景图 */
	momentsBackgroundInfo?: string;
	/** 是否点赞了该好友的背景图 */
	momentsBackgroundLike: boolean;
	/** 朋友圈权限 */
	momentsPrivacy: "all" | "lastSixMonths" | "lastOneMonth" | "lastThreeDays";
	/** 拍一拍文案 */
	tickleText?: string;
	/** 微信号 */
	wechat: string;
	/** 微信豆个数 */
	coin?: number;
	/** 是否是星标好友 */
	isStarred?: boolean;
	gender?: "male" | "female";
	/** 是否隐藏性别 */
	hideGender?: boolean;
	phone?: string[];
	/** 标签 */
	tags?: string[];
	/** 描述 */
	description?: string;
	area?: string;
	/** 朋友圈签名 */
	signature?: string;
	/** 朋友权限 */
	privacy: "all" | "chatsOnly" | "hideMyPosts" | "hideFriendPosts";
	/** 朋友圈缩略图，展示在个人信息界面 */
	thumbnailInfo: string[];
	hideThumbnail?: boolean;
	createdByFaker?: boolean;
}

export interface TStateFriendsTotalCountDisplay {
	calcuateType: "auto" | "static";
	count?: number;
}

export type TNeedGroupDataItem = {
	id: IStateProfile["id"];
	name: string;
	isStarred?: boolean;
	description?: string;
	avatarInfo: string;
};

export type TStateAllProfiles = IStateProfile[];
