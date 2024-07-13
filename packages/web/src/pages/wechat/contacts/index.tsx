import AddFriendSVG from "@/assets/add-friend-outlined.svg?react";
import SearchOutlinedSVG from "@/assets/search-outlined.svg?react";
import { canBeDetected } from "@/components/NodeDetected";
import { useMemoScrollPos } from "@/components/useMemoScrollPos";
import { MetaDataType } from "@/state/detectedNode";
import { EBottomNavBars } from "@/stateV2/bottomNavbars";
import { allProfilesAnchorDataAtom } from "@/stateV2/profile";
import BottomNavbar, { useToggleNavbarActivated } from "@/wechatComponents/BottomNavbar";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ContactsList from "./ContactsList";
import Anchor from "./RightAnchor";
import TopMenus from "./TopMenus";
import Total from "./Total";
import { getStuckInfo } from "./utils";

const DATA_WHEEL_ID = "contactsLayout";

const Contacts = () => {
	useToggleNavbarActivated(EBottomNavBars.ADDRESS_BOOK);
	const { t } = useTranslation();

	const anchorData = useAtomValue(allProfilesAnchorDataAtom);

	const { scrollRef } = useMemoScrollPos(DATA_WHEEL_ID);

	const [stuckInfo, setStuckInfo] = useState<Map<string, boolean>>(() => getStuckInfo(anchorData));

	return (
		<>
			<div className="grid grid-cols-3 justify-center bg-[rgba(237,237,237,1)] px-4 py-2">
				<div />
				<div className="flex items-center justify-center font-medium">
					{t("wechatPage.contacts.title")}
				</div>
				<div className="flex items-center justify-end">
					<AddFriendSVG height={20} width={20} fill="black" className="cursor-pointer" />
				</div>
			</div>
			<canBeDetected.div
				className="flex flex-1 flex-col overflow-y-auto bg-white"
				id="contacts-container"
				innerRef={scrollRef}
				data-wheel-id={DATA_WHEEL_ID}
				metaData={{
					type: MetaDataType.ContactsContainer,
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

			<Anchor
				data={anchorData}
				stuckInfo={stuckInfo}
				handleQuickJump={(key) => {
					const el = document.getElementById(key);
					if (el) {
						el.scrollIntoView();
					}
				}}
			/>
			<BottomNavbar />
		</>
	);
};

export default Contacts;
