import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { canBeDetected } from "@/components/NodeDetected";
import { MetaDataType } from "@/state/detectedNode";
import { friendsTotalCountState } from "@/state/profile";

const Total = () => {
	const { count } = useRecoilValue(friendsTotalCountState);
	const { t } = useTranslation();
	return (
		<canBeDetected.div
			metaData={{
				type: MetaDataType.FriendsTotalCount,
				treeItemDisplayName: (data) => `好友总数 ${data.count} 人`,
			}}
			className="flex items-center justify-center py-3 text-black/60"
		>
			{t("wechatPage.contacts.total", {
				num: count,
			})}
		</canBeDetected.div>
	);
};

export default memo(Total);
