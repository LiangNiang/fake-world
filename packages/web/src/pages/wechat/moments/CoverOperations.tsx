import AlbumFilledSVG from "@/assets/album-filled.svg?react";
import LikeFilledSVG from "@/assets/like-filled.svg?react";
import LikeOutlinedSVG from "@/assets/like-outlined.svg?react";
import { MYSELF_ID } from "@/faker/wechat/user";
import { activatedNodeAtom, getAllNodesValueSnapshot } from "@/stateV2/detectedNode";
import { getModeValueSnapshot, modeAtom } from "@/stateV2/mode";
import { setProfileValue } from "@/stateV2/profile";
import { usePrevious } from "ahooks";
import { useSetAtom } from "jotai";
import { values } from "lodash-es";
import { useTranslation } from "react-i18next";
import { twJoin } from "tailwind-merge";
import { useProfile } from "./hook";

const CoverOperations = () => {
	const { id, momentsBackgroundLike } = useProfile();
	const previousMomentsBackgroundLike = usePrevious(momentsBackgroundLike);
	const { t } = useTranslation();
	const setMode = useSetAtom(modeAtom);
	const setActivatedNode = useSetAtom(activatedNodeAtom);

	const isMySelf = id === MYSELF_ID;

	const handleChangeCover = () => {
		setMode("edit");
		const nodes = getAllNodesValueSnapshot();
		setActivatedNode(values(nodes)[0].id);
	};

	const handleChangeLike = () => {
		if (getModeValueSnapshot() === "edit") return;
		setProfileValue(id, (prev) => ({
			...prev,
			momentsBackgroundLike: !prev.momentsBackgroundLike,
		}));
	};

	return (
		<div
			className={twJoin(
				"-top-12 absolute right-4 flex origin-center scale-90 cursor-pointer items-center",
				isMySelf
					? "flex-col space-y-1"
					: "flex-row space-x-[2px] rounded-xl border border-white px-1 py-[1px]",
			)}
			onClick={isMySelf ? handleChangeCover : handleChangeLike}
		>
			{isMySelf ? (
				<>
					<AlbumFilledSVG fill="white" />
					<span className="text-white text-xs">{t("wechatPage.moments.changeCover")}</span>
				</>
			) : (
				<>
					{momentsBackgroundLike ? (
						<LikeFilledSVG
							fill="#E14949"
							className={twJoin(
								"h-5 w-5",
								previousMomentsBackgroundLike === false && "animate-jump animate-once",
							)}
						/>
					) : (
						<LikeOutlinedSVG fill="white" className="h-5 w-5" />
					)}
					<span className="text-sm text-white">{t("wechatPage.moments.like")}</span>
				</>
			)}
		</div>
	);
};

export default CoverOperations;
