import ArrowOutlinedSVG from "@/assets/arrow-outlined.svg?react";
import BackFilledSVG from "@/assets/back-filled.svg?react";
import FemaleIMG from "@/assets/female.png";
import MaleIMG from "@/assets/male.png";
import MoreFilledSVG from "@/assets/more-filled.svg?react";
import VideoCallOutlinedSVG from "@/assets/video-call-outlined.svg?react";
import WechatSVG from "@/assets/wechat.svg?react";
import { h } from "@/components/HashAssets";
import { canBeDetected } from "@/components/NodeDetected";
import useModeNavigate from "@/components/useModeNavigate";
import { MYSELF_ID } from "@/faker/wechat/user";
import { EMetaDataType, type StaticMetaData } from "@/stateV2/detectedNode";
import { dialogueListAtom } from "@/stateV2/dialogueList";
import { type IStateProfile, PRIVACY_TEXT_MAP, profileAtom } from "@/stateV2/profile";
import dayjs from "dayjs";
import { useAtomValue, useSetAtom } from "jotai";
import { isEmpty, isString } from "lodash-es";
import { nanoid } from "nanoid";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { twJoin } from "tailwind-merge";

const GENDER_IMAGES = {
	male: MaleIMG,
	female: FemaleIMG,
};

const Friend = () => {
	const { id: userId } = useParams<{ id: string }>();
	const setDialogueList = useSetAtom(dialogueListAtom);
	const profile = useAtomValue(profileAtom(userId ?? ""));
	const navigate = useModeNavigate();
	const { t } = useTranslation();

	const isMyself = userId === MYSELF_ID;

	if (!profile) return <></>;

	const {
		avatarInfo,
		gender,
		nickname,
		wechat,
		hideGender,
		remark,
		area,
		phone,
		tags,
		privacy,
		thumbnailInfo,
		hideThumbnail,
		description,
	} = profile;

	const getMetaData = (): StaticMetaData.InjectMetaData => {
		const treeItemDisplayName = (data: IStateProfile) => `信息编辑（${data.nickname}）`;

		if (isMyself) {
			return {
				type: EMetaDataType.MyProfile,
				treeItemDisplayName,
			};
		}
		return {
			type: EMetaDataType.FirendProfile,
			index: userId!,
			treeItemDisplayName,
		};
	};

	const getPrivacyText = () => {
		if (privacy === undefined) return null;
		const handle = PRIVACY_TEXT_MAP[privacy];
		if (isString(handle)) {
			return t(handle);
		}
		return handle(gender!, t);
	};

	return (
		<canBeDetected.div className="flex flex-1 flex-col overflow-hidden" metaData={getMetaData()}>
			<div className="flex justify-between px-4 py-2">
				<BackFilledSVG
					fill="black"
					className="h-5 w-5 cursor-pointer"
					onClick={() => navigate(-1)}
				/>
				<MoreFilledSVG fill="black" className="h-5 w-5" />
			</div>
			<div className="flex flex-1 flex-col overflow-auto bg-[rgba(237,237,237,1)]">
				<div className={twJoin("flex bg-white py-6 pl-5", !isMyself && "border-black/5 border-b")}>
					<h.img
						src={avatarInfo}
						className="my-2 h-16 w-16 rounded-md object-cover object-center"
					/>
					<div className="ml-4 flex flex-col space-y-[2px]">
						<div className="flex items-center space-x-2">
							<div className="font-medium text-lg">{isEmpty(remark) ? nickname : remark}</div>
							{gender && !hideGender && (
								<img src={GENDER_IMAGES[gender]} className="h-[14px] w-[14px]" />
							)}
						</div>
						{remark && (
							<div className="space-x-2 text-black/60 text-sm">
								<span>{t("wechatPage.friend.nickname")}</span>
								<span>{nickname}</span>
							</div>
						)}
						<div className="space-x-2 text-black/60 text-sm">
							<span>{t("wechatPage.friend.wid")}</span>
							<span>{wechat}</span>
						</div>
						{area && (
							<div className="space-x-2 text-black/60 text-sm">
								<span>{t("wechatPage.friend.region")}</span>
								<span>{area}</span>
							</div>
						)}
					</div>
				</div>
				{!isMyself && (
					<>
						{isEmpty(description) && isEmpty(tags) && (
							<div className="flex cursor-pointer border-black/5 border-b bg-white py-3 pl-5">
								<div className="w-20 whitespace-pre">{t("wechatPage.friend.editContact")}</div>
								<div className="flex flex-1 pr-3">
									<div className="text-black/50" />
									<ArrowOutlinedSVG fill="rgba(0,0,0,0.3)" className="ml-auto w-[18px]" />
								</div>
							</div>
						)}
						{!isEmpty(phone) && (
							<div className="flex border-black/5 border-b bg-white pl-5">
								<div className="w-20 py-3">{t("wechatPage.friend.mobile")}</div>
								<div className="flex flex-1 flex-col">
									{phone?.map((v, i) => (
										<div
											className="cursor-pointer border-black/5 border-b py-3 text-wechatLink-1 last:border-none"
											key={i}
										>
											{v}
										</div>
									))}
								</div>
							</div>
						)}
						{!isEmpty(tags) && (
							<div className="flex cursor-pointer border-black/5 border-b bg-white py-3 pl-5">
								<div className="w-20 whitespace-pre">{t("wechatPage.friend.tags")}</div>
								<div className="flex flex-1 pr-3">
									<div className="text-black/50">{tags?.join(", ")}</div>
									<ArrowOutlinedSVG fill="rgba(0,0,0,0.3)" className="ml-auto w-[18px]" />
								</div>
							</div>
						)}
						{!isEmpty(description) && (
							<div className="flex cursor-pointer border-black/5 border-b bg-white py-3 pl-5">
								<div className="w-20">{t("wechatPage.friend.desc")}</div>
								<div className="flex flex-1 pr-3">
									<div className="text-black/50">{description}</div>
									<ArrowOutlinedSVG fill="rgba(0,0,0,0.3)" className="ml-auto w-[18px]" />
								</div>
							</div>
						)}
						<div className="flex cursor-pointer bg-white py-3 pl-5">
							<div className="w-20">{t("wechatPage.friend.privacy")}</div>
							<div className="flex flex-1 pr-3">
								<div className="text-black/50">{getPrivacyText()}</div>
								<ArrowOutlinedSVG fill="rgba(0,0,0,0.3)" className="ml-auto w-[18px]" />
							</div>
						</div>
					</>
				)}
				<div className="mb-12">
					<div className="mt-2 cursor-pointer bg-white">
						{!hideThumbnail && (
							<div
								className="ml-5 flex items-center border-black/5 border-b py-3"
								onClick={() => navigate(`/wechat/moments/user/${userId}`)}
							>
								<div className="w-20">{t("wechatPage.friend.moments")}</div>
								<div className="flex flex-1 items-center pr-3">
									<div className="mr-5 grid flex-1 grid-cols-5 gap-1">
										{thumbnailInfo.length === 0 && <div className="aspect-h-1 aspect-w-1" />}
										{thumbnailInfo.map((v, i) => (
											<div key={i} className="aspect-h-1 aspect-w-1">
												<h.img src={v} className="rounded-sm object-cover object-center" />
											</div>
										))}
									</div>
									<ArrowOutlinedSVG fill="rgba(0,0,0,0.3)" className="ml-auto w-[18px]" />
								</div>
							</div>
						)}
						<div className="ml-5 flex py-3">
							<div className="w-20">{t("wechatPage.friend.more")}</div>
							<div className="flex flex-1 pr-3">
								<ArrowOutlinedSVG fill="rgba(0,0,0,0.3)" className="ml-auto w-[18px]" />
							</div>
						</div>
					</div>
					<div className="mt-2 cursor-pointer bg-white">
						<div
							className={twJoin(
								"flex items-center justify-center space-x-2 py-3 text-wechatLink-1",
								!isMyself && "border-black/5 border-b",
							)}
							onClick={() => {
								if (userId) {
									navigate(`/wechat/conversation/${userId}`);
									setDialogueList((prev) => {
										if (prev.some((v) => v.friendId === userId)) return prev;
										return [
											{
												id: nanoid(5),
												friendId: userId,
												lastMessage: "进入编辑模式修改该文本",
												lastMessageTime: dayjs().format("HH:mm"),
											},
											...prev,
										];
									});
								}
							}}
						>
							<WechatSVG stroke="#465677" className="h-5 w-5" />
							<span className="font-medium">{t("wechatPage.friend.sendMessage")}</span>
						</div>
						{!isMyself && (
							<div className="flex items-center justify-center space-x-2 border-black/5 border-b py-3 text-wechatLink-1">
								<VideoCallOutlinedSVG fill="#465677" className="h-5 w-5" />
								<span className="font-medium">{t("wechatPage.friend.call")}</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</canBeDetected.div>
	);
};

export default Friend;
