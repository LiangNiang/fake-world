import SearchOutlinedSVG from "@/assets/search-outlined.svg?react";
import { canBeDetected } from "@/components/NodeDetected";
import { useMemoScrollPos } from "@/components/useMemoScrollPos";
import { EMetaDataType } from "@/stateV2/detectedNode";
import { allProfilesAnchorDataAtom } from "@/stateV2/profile";
import { t } from "i18next";
import { useAtomValue } from "jotai";
import { memo, useState } from "react";
import ContactsList from "./ContactsList";
import RightAnchor from "./RightAnchor";
import TopMenus from "./TopMenus";
import Total from "./Total";
import { getStuckInfo } from "./utils";

const DATA_WHEEL_ID = "contactsLayout";

const MainSection = () => {
	const { scrollRef } = useMemoScrollPos(DATA_WHEEL_ID);
	const anchorData = useAtomValue(allProfilesAnchorDataAtom);
	const [stuckInfo, setStuckInfo] = useState<Map<string, boolean>>(() => getStuckInfo(anchorData));

	return (
		<>
			<canBeDetected.div
				className="flex flex-1 flex-col overflow-y-auto bg-white"
				id="contacts-container"
				innerRef={scrollRef}
				data-wheel-id={DATA_WHEEL_ID}
				metaData={{
					type: EMetaDataType.ContactsContainer,
					treeItemDisplayName: (data) => `通讯录（${data.length - 1}位好友）`,
				}}
			>
				<div className="flex bg-[rgba(237,237,237,1)] px-2 pb-3">
					<div className="flex flex-1 items-center justify-center rounded-[4px] bg-white p-2 text-xs">
						<SearchOutlinedSVG fill="rgba(0, 0, 0, 0.5)" width={17} height={16} />
						<span className="ml-2 opacity-50">{t("wechatPage.main.search")}</span>
					</div>
				</div>
				<TopMenus />
				<ContactsList anchorData={anchorData} stuckInfo={stuckInfo} setStuckInfo={setStuckInfo} />
				<Total />
			</canBeDetected.div>

			<RightAnchor
				data={anchorData}
				stuckInfo={stuckInfo}
				handleQuickJump={(key) => {
					const el = document.getElementById(key);
					if (el) {
						el.scrollIntoView();
					}
				}}
			/>
		</>
	);
};

export default memo(MainSection);
