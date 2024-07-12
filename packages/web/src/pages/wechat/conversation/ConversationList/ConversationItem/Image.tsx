import PlayFilledSVG from "@/assets/play-filled.svg?react";
import { h } from "@/components/HashAssets";
import { ImageDBManager } from "@/dataSource";
import type { IProfile } from "@/state/profile";
import type { IConversationTypeImage } from "@/stateV2/conversation";
import { isMD5 } from "@/utils";
import { memo, useEffect, useState } from "react";
import { twJoin } from "tailwind-merge";
import CommonBlock from "./CommonBlock";

type Props = {
	imageInfo: IConversationTypeImage["imageInfo"];
	upperText: IConversationTypeImage["upperText"];
	senderId: IProfile["id"];
	role: IConversationTypeImage["role"];
	isVideo?: boolean;
};

const Image = ({ imageInfo, upperText, senderId, role, isVideo }: Props) => {
	const [imageShape, setimageShape] = useState<"wide" | "long" | null>(null);

	useEffect(() => {
		if (isMD5(imageInfo)) {
			ImageDBManager.initDBImagesCacheStore().then(() => {
				calcShape(ImageDBManager.IMAGES_CACHE.get(imageInfo) ?? "");
			});
		} else {
			calcShape(imageInfo);
		}
	}, [imageInfo]);

	const calcShape = (src: string) => {
		const img = new window.Image();
		img.src = src;
		img.onload = () => {
			const { width, height } = img;
			if (width >= height) {
				setimageShape("wide");
			} else if (width < height) {
				setimageShape("long");
			}
		};
	};

	if (imageShape === null) return null;

	return (
		<CommonBlock
			upperText={upperText}
			senderId={senderId}
			innerBlockClassName={twJoin("p-0 flex", role === "mine" ? "justify-end" : "justify-start")}
		>
			<div
				className={twJoin(
					imageShape === "wide" && "max-w-[80%]",
					imageShape === "long" && "max-w-[40%]",
					isVideo && "relative",
				)}
			>
				<h.img src={imageInfo} className="rounded object-contain object-center" />
				{isVideo && (
					<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 cursor-pointer rounded-full border border-white p-1">
						<PlayFilledSVG fill="white" width={32} height={32} />
					</div>
				)}
			</div>
		</CommonBlock>
	);
};

export default memo(Image);
