import { useParams } from "react-router-dom";
import { useRecoilValue, waitForAll } from "recoil";

import BackFilledSVG from "@/assets/back-filled.svg?react";
import MoreFilledSVG from "@/assets/more-filled.svg?react";
import { canBeDetected } from "@/components/NodeDetected";
import useModeNavigate from "@/components/useModeNavigate";
import { MetaDataType } from "@/state/detectedNode";
import { friendState } from "@/state/profile";
import totalUnreadCountState from "@/state/totalUnreadCountState";

const ConversationHeader = () => {
	const { id } = useParams<{ id: string }>();
	const [totalUnreadCount, friendProfile] = useRecoilValue(
		waitForAll([totalUnreadCountState, friendState(id ?? "")]),
	);
	const navigate = useModeNavigate();

	return (
		<div className="grid grid-cols-3 border-black/5 border-b bg-[#F5F5F5] px-4 py-2">
			<div className="flex items-center">
				<BackFilledSVG
					fill="black"
					className="h-5 w-5 cursor-pointer"
					onClick={() => {
						navigate("/wechat");
					}}
				/>
				<canBeDetected.div
					className="ml-1 rounded-2xl bg-[rgba(0,0,0,0.15)] px-2 py-[2px] text-xs"
					metaData={{
						type: MetaDataType.TotalUnreadCount,
						treeItemDisplayName: "未读消息数",
					}}
				>
					{totalUnreadCount.count}
				</canBeDetected.div>
			</div>
			<div className="flex items-center justify-center">
				{friendProfile.remark ?? friendProfile.nickname}
			</div>
			<div className="flex items-center justify-end">
				<MoreFilledSVG fill="black" className="h-5 w-5" />
			</div>
		</div>
	);
};

export default ConversationHeader;
