import { canBeDetected } from "@/components/NodeDetected";
import { EMetaDataType } from "@/stateV2/detectedNode";
import { friendsTotalCountAtom } from "@/stateV2/profile";
import { useAtomValue } from "jotai";
import { memo } from "react";
import { useTranslation } from "react-i18next";

const Total = () => {
	const count = useAtomValue(friendsTotalCountAtom);
	const { t } = useTranslation();
	return (
		<canBeDetected.div
			metaData={{
				type: EMetaDataType.FriendsTotalCount,
				treeItemDisplayName: (data) =>
					`好友总数 ${data.calcuateType === "auto" ? count : data.count} 人`,
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
