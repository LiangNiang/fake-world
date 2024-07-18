import BackFilledSVG from "@/assets/back-filled.svg?react";
import MoreFilledSVG from "@/assets/more-filled.svg?react";
import StickerOutlinedSVG from "@/assets/sticker-outlined.svg?react";
import useModeNavigate from "@/components/useModeNavigate";
import { generateInitFeedComment } from "@/faker/wechat/moments";
import { feedAtom } from "@/stateV2/moments";
import { useAtom } from "jotai";
import { useParams } from "react-router-dom";
import Feed from "./Feed";

const feedClassNames = {
	container: "border-none p-3 flex-1 overflow-auto",
	avatar: "h-10 w-10",
};

const MomentDetail = () => {
	const { id: feedId } = useParams();
	const [feed, setFeed] = useAtom(feedAtom(feedId ?? ""))!;
	const navigate = useModeNavigate();

	if (!feed) return null;

	return (
		<>
			<div className="grid grid-cols-3 bg-[rgba(237,237,237,1)] px-4 py-2">
				<BackFilledSVG
					fill="black"
					className="h-5 w-5 cursor-pointer"
					onClick={() => navigate(-1)}
				/>
				<div className="flex items-center justify-center font-medium">详情</div>
				<div className="flex items-center justify-end">
					<MoreFilledSVG fill="black" className="h-5 w-5" />
				</div>
			</div>
			<Feed id={feedId ?? ""} userId={feed.userId} classNames={feedClassNames} fromDetail />
			<div
				className="flex cursor-pointer space-x-1 bg-wechatBG-3 py-2 pr-3 pb-2 pl-1"
				onClick={() => {
					setFeed((prev) => ({
						...prev,
						comments: [...(prev.comments ?? []), generateInitFeedComment()],
					}));
				}}
			>
				<div className="flex h-8 flex-1 items-center rounded bg-white px-3 py-2 text-gray-400 text-sm">
					评论
				</div>
				<StickerOutlinedSVG fill="#000" className="h-8 w-8" />
			</div>
		</>
	);
};

export default MomentDetail;
