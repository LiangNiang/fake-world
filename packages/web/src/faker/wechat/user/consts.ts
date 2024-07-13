import type { IStateProfile, TStateAllProfiles } from "@/stateV2/profile";

export const MYSELF_ID = "0";

export const INIT_MY_PROFILE: IStateProfile = {
	id: MYSELF_ID,
	nickname: "林克",
	avatarInfo: "https://cdn-fakeworld.azureedge.net/fakeworld/ppf3dl.jpg",
	wechat: "link",
	momentsBackgroundInfo: "https://cdn-fakeworld.azureedge.net/fakeworld/pnqqk6.jpg",
	momentsPrivacy: "all",
	gender: "male",
	thumbnailInfo: [],
	momentsBackgroundLike: false,
	privacy: "all",
	area: "Hyrule",
	signature: "Master Sword!!!!",
};

export const INIT_FRIENDS: TStateAllProfiles = [
	{
		id: "1",
		nickname: "塞尔达",
		avatarInfo: "https://cdn-fakeworld.azureedge.net/fakeworld/ppf5ki.jpg",
		wechat: "zelda",
		gender: "female",
		privacy: "all",
		thumbnailInfo: [],
		momentsBackgroundInfo: "https://cdn-fakeworld.azureedge.net/fakeworld/pnqz5x.jpg",
		momentsBackgroundLike: false,
		momentsPrivacy: "all",
		signature: "塞尔达的朋友圈签名",
		area: "Hyrule",
		remark: "老婆",
		isStarred: true,
	},
	{
		id: "2",
		nickname: "星之笨比",
		avatarInfo: "https://cdn-fakeworld.azureedge.net/fakeworld/ppf1ga.jpg",
		wechat: "kirby",
		privacy: "all",
		thumbnailInfo: [],
		momentsBackgroundInfo: "https://cdn-fakeworld.azureedge.net/fakeworld/pnqz5x.jpg",
		momentsBackgroundLike: false,
		momentsPrivacy: "all",
	},
	{
		id: "3",
		nickname: "超级马里奥",
		remark: "大叔",
		avatarInfo: "https://cdn-fakeworld.azureedge.net/fakeworld/ppf2xb.jpg",
		wechat: "mario",
		gender: "male",
		privacy: "all",
		thumbnailInfo: [],
		momentsBackgroundInfo: "https://cdn-fakeworld.azureedge.net/fakeworld/pnqz5x.jpg",
		momentsBackgroundLike: false,
		momentsPrivacy: "all",
		description: "水管工",
	},
	{
		id: "4",
		nickname: "超级路易基",
		avatarInfo: "https://cdn-fakeworld.azureedge.net/fakeworld/sac40y.jpg",
		wechat: "luigi",
		remark: "小绿帽",
		gender: "male",
		privacy: "all",
		thumbnailInfo: [],
		momentsBackgroundInfo: "https://cdn-fakeworld.azureedge.net/fakeworld/pnqz5x.jpg",
		momentsBackgroundLike: false,
		momentsPrivacy: "all",
	},
];
