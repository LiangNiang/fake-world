import { memo } from "react";

import { h } from "@/components/HashAssets";
import { canBeDetected } from "@/components/NodeDetected";
import useModeNavigate from "@/components/useModeNavigate";

import { usePartMetaData, useProfile } from "./hook";

const TopAvatar = () => {
	const { nickname, avatarInfo, remark, id } = useProfile();
	const metaDataPart = usePartMetaData();
	const navigate = useModeNavigate({ silence: true });

	return (
		<canBeDetected.div
			className="-top-12 absolute right-4 flex flex-col items-end"
			metaData={{
				treeItemDisplayName: "昵称 + 头像",
				...metaDataPart,
			}}
		>
			<div className="flex cursor-pointer" onClick={() => navigate(`/wechat/friend/${id}`)}>
				<div className="mt-2 mr-3 font-medium text-white text-xl">{remark ?? nickname}</div>
				<h.img src={avatarInfo} className="h-16 w-16 rounded-md" />
			</div>
		</canBeDetected.div>
	);
};

export default memo(TopAvatar);
