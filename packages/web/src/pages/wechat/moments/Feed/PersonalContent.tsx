import PlayFilledSVG from "@/assets/play-filled.svg?react";
import { h } from "@/components/HashAssets";
import { canBeDetected } from "@/components/NodeDetected";
import TopOperations from "@/components/TopOperations";
import useModeNavigate from "@/components/useModeNavigate";
import { MYSELF_ID } from "@/faker/wechat/user";
import { MetaDataType } from "@/state/detectedNode";
import { type IStateFeed, feedAtom, feedListAtom } from "@/stateV2/moments";
import SlateText from "@/wechatComponents/SlateText";
import { SLATE_EMPTY_VALUE } from "@/wechatComponents/SlateText/utils";
import { Modal } from "antd";
import dayjs from "dayjs";
import { useAtomValue, useSetAtom } from "jotai";
import { twJoin } from "tailwind-merge";

type Props = {
	id: IStateFeed["id"];
};

const PersonalContent = ({ id }: Props) => {
	const { content, userId } = useAtomValue(feedAtom(id))!;
	const setFeedList = useSetAtom(feedListAtom);
	const navigate = useModeNavigate();

	const handleOperationDelete = () => {
		Modal.confirm({
			title: "是否删除该条朋友圈？",
			onOk: () => {
				setFeedList((v) => v.filter((v) => v.id !== id));
			},
		});
	};

	const renderFeedImages = () => {
		const { type } = content;
		switch (type) {
			case "textWithImages": {
				const length = content.imagesInfo.length;
				if (length === 1) {
					return (
						<div className="h-18 w-18">
							<h.img
								src={content.imagesInfo[0]}
								className="h-18 w-full object-cover object-center"
							/>
						</div>
					);
				}
				if (length === 2) {
					return (
						<div className="grid h-18 w-18 grid-cols-2 gap-[2px]">
							<h.img src={content.imagesInfo[0]} className="h-18 object-cover object-center" />
							<h.img src={content.imagesInfo[1]} className="h-18 object-cover object-center" />
						</div>
					);
				}
				if (length === 3) {
					return (
						<div className="grid h-18 w-18 grid-cols-2 gap-[2px]">
							<h.img src={content.imagesInfo[0]} className="h-18 object-cover object-center" />
							<div className="grid h-18 grid-rows-2 gap-[2px]">
								<h.img
									src={content.imagesInfo[1]}
									className="h-full w-full object-cover object-center"
								/>
								<h.img
									src={content.imagesInfo[2]}
									className="h-full w-full object-cover object-center"
								/>
							</div>
						</div>
					);
				}
				if (length >= 4) {
					return (
						<div className="grid h-18 w-18 grid-cols-2 gap-[2px]">
							{content.imagesInfo.slice(0, 4).map((v, i) => (
								<div key={i} className="aspect-h-1 aspect-w-1">
									<h.img src={v} className="h-full object-cover object-center" />
								</div>
							))}
						</div>
					);
				}
				return null;
			}
			case "video":
				if (content.videoInfo) {
					return (
						<div className="relative h-18 w-18">
							<h.img src={content.videoInfo} className="h-full w-full object-cover object-center" />
							<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex h-auto w-auto origin-center scale-75 cursor-pointer items-center justify-center rounded-full border border-white">
								<PlayFilledSVG fill="white" width={20} height={20} />
							</div>
						</div>
					);
				}
				return null;
			default:
				return null;
		}
	};

	const renderFeedPureText = () => {
		const { type } = content;
		switch (type) {
			case "text":
				return (
					<div className="line-clamp-2 flex-1 bg-wechatBG-3 p-1">
						<SlateText content={content.text} />
					</div>
				);
			case "textWithImages":
			case "video": {
				const assetsLength = content.type === "textWithImages" ? content.imagesInfo.length : 1;
				if (assetsLength === 1) {
					return (
						<div className="ml-1 line-clamp-3 flex-1">
							<SlateText content={content.text ?? SLATE_EMPTY_VALUE} />
						</div>
					);
				}
				return (
					<div className="ml-1 flex flex-1 flex-col justify-between">
						<div className="line-clamp-2">
							<SlateText content={content.text ?? SLATE_EMPTY_VALUE} />
						</div>
						<div className="text-black/60 text-xs">
							共<span className="mx-[2px]">{assetsLength}</span>张
						</div>
					</div>
				);
			}
			default:
				return null;
		}
	};

	return (
		<canBeDetected.div
			className={twJoin("flex cursor-pointer", content.type !== "text" && "h-18")}
			onClick={() => navigate(`/wechat/moments/${id}`)}
			metaData={[
				{
					type: MetaDataType.MomentsFeed,
					index: id,
					label: "朋友圈",
					treeItemDisplayName: (data) => `${dayjs(data.sendTimestamp).format("YYYY年MM月DD日")}`,
					operations: [
						{
							onClick: handleOperationDelete,
							element: <TopOperations.OperaionDeleteBase />,
						},
						{
							onClick: TopOperations.OperationSelectParent.selectParentNode,
							element: <TopOperations.OperationNewBase tooltipProps={{ title: "新增朋友圈" }} />,
						},
					],
				},
				userId === MYSELF_ID
					? {
							type: MetaDataType.MyProfile,
							label: "用户信息",
						}
					: {
							type: MetaDataType.FirendProfile,
							index: userId,
							treeItemDisplayName: (data) => `${data.nickname}的朋友圈`,
							label: "用户信息",
						},
			]}
		>
			{renderFeedImages()}
			{renderFeedPureText()}
		</canBeDetected.div>
	);
};

export default PersonalContent;
