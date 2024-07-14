import CommentOutlinedSVG from "@/assets/comment-outlined.svg?react";
import LikeFilledSVG from "@/assets/like-filled.svg?react";
import LikeOutlinedSVG from "@/assets/like-outlined.svg?react";
import More2OutlinedSVG from "@/assets/more-2-outlined.svg?react";
import PlayFilledSVG from "@/assets/play-filled.svg?react";
import { h } from "@/components/HashAssets";
import { generateInitFeedComment } from "@/faker/wechat/moments";
import { MYSELF_ID } from "@/faker/wechat/user";
import { getModeValueSnapshot } from "@/stateV2/mode";
import { type IStateFeed, feedAtom } from "@/stateV2/moments";
import SlateText from "@/wechatComponents/SlateText";
import { SLATE_EMPTY_VALUE } from "@/wechatComponents/SlateText/utils";
import {
	offset,
	useClick,
	useDismiss,
	useFloating,
	useInteractions,
	useTransitionStyles,
} from "@floating-ui/react";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { isEqual } from "lodash-es";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { twJoin } from "tailwind-merge";

type Props = {
	id: IStateFeed["id"];
	fromDetail?: boolean;
};

const FeedContent = ({ id, fromDetail }: Props) => {
	const [feed, setFeed] = useAtom(feedAtom(id));
	const [operationsVisible, setOperationsVisible] = useState(false);
	const { refs, floatingStyles, context } = useFloating({
		open: operationsVisible,
		onOpenChange: (v) => {
			getModeValueSnapshot() === "preview" && setOperationsVisible(v);
		},
		placement: "left",
		middleware: [offset(8)],
	});
	const click = useClick(context);
	const dismiss = useDismiss(context);
	const { isMounted, styles: animationStyles } = useTransitionStyles(context, {
		initial: {
			transform: "scaleX(0)",
		},
	});
	const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);
	const { t, i18n } = useTranslation();

	if (!feed) return null;

	const { content, sendTimestamp, likeUserIds } = feed;

	const isLiked = likeUserIds?.includes(MYSELF_ID);
	const isEN = i18n.language === "en-US";

	const renderFeedPureText = () => {
		const { type } = content;
		switch (type) {
			case "text":
			case "textWithImages":
			case "video":
				if (content.text && !isEqual(content.text, SLATE_EMPTY_VALUE)) {
					return (
						<div className="mt-1">
							<SlateText content={content.text} />
						</div>
					);
				}
				return null;
			default:
				return null;
		}
	};

	const renderFeedImages = () => {
		const { type } = content;
		switch (type) {
			case "textWithImages": {
				const length = content.imagesInfo.length;
				if (length >= 2) {
					return (
						<div className={twJoin("mt-2 grid grid-cols-3 gap-1", fromDetail && "mr-[25%]")}>
							{content.imagesInfo.map((img, i) => (
								<div key={i} className="aspect-h-1 aspect-w-1">
									<h.img src={img} className="col-span-1 object-cover object-center" />
								</div>
							))}
						</div>
					);
				}
				if (length === 1) {
					return (
						<div className="mt-2 grid grid-cols-5 gap-1">
							<div className="col-span-3 aspect-h-1 aspect-w-1">
								<h.img src={content.imagesInfo[0]} className="object-cover object-center" />
							</div>
						</div>
					);
				}
				return null;
			}
			case "video":
				if (content.videoInfo) {
					return (
						<div className="mt-2 grid grid-cols-5 gap-1">
							<div className="relative col-span-3">
								<h.img src={content.videoInfo} className="object-cover object-center" />
								<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 cursor-pointer rounded-full border border-white p-1">
									<PlayFilledSVG fill="white" width={32} height={32} />
								</div>
							</div>
						</div>
					);
				}
				return null;
			default:
				return null;
		}
	};

	const handleLikeByMyself = () => {
		setOperationsVisible(false);
		setFeed((prev) => ({
			...prev,
			likeUserIds: isLiked
				? [...(prev.likeUserIds ?? []).filter((v) => v !== MYSELF_ID)]
				: [...(prev.likeUserIds ?? []), MYSELF_ID],
		}));
	};

	const handleClickComment = () => {
		setOperationsVisible(false);
		setFeed((prev) => ({
			...prev,
			comments: [...(prev.comments ?? []), generateInitFeedComment()],
		}));
	};

	return (
		<>
			{renderFeedPureText()}
			{renderFeedImages()}
			<div className="mt-2 flex items-center justify-between">
				<span className="text-gray-400 text-sm">{dayjs(sendTimestamp).fromNow()}</span>
				<div
					ref={refs.setReference}
					{...getReferenceProps()}
					className="cursor-pointer select-none rounded bg-wechatBG-3 py-[2px] pl-2"
				>
					<More2OutlinedSVG fill="#465677" className="h-4 w-6 scale-150" />
				</div>
				{isMounted && (
					<div
						ref={refs.setFloating}
						style={floatingStyles}
						{...getFloatingProps()}
						className="flex select-none text-white"
					>
						<div className="flex origin-right rounded bg-wechatBG-2" style={animationStyles}>
							<div
								className={twJoin(
									"relative flex cursor-pointer items-center justify-center rounded rounded-r-none py-1 text-xs after:absolute after:right-0 after:h-3 after:w-[1px] after:bg-black hover:bg-wechatBG-1",
									isEN && "w-24",
									!isEN && "w-18",
								)}
								onClick={handleLikeByMyself}
							>
								{isLiked ? (
									<>
										<LikeFilledSVG fill="#E14949" className="mr-[2px] h-5 w-5" />
										{t("wechatPage.moments.cancel")}
									</>
								) : (
									<>
										<LikeOutlinedSVG fill="white" className="mr-[2px] h-5 w-5" />
										{t("wechatPage.moments.like")}
									</>
								)}
							</div>
							<div
								className={twJoin(
									"flex cursor-pointer items-center justify-center rounded rounded-l-none py-1 text-xs hover:bg-wechatBG-1",
									isEN && "w-24",
									!isEN && "w-18",
								)}
								onClick={handleClickComment}
							>
								<CommentOutlinedSVG fill="white" className="mr-[2px] h-5 w-5" />
								{t("wechatPage.moments.comment")}
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default memo(FeedContent);
