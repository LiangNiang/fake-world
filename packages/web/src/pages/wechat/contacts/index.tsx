import AddFriendSVG from "@/assets/add-friend-outlined.svg?react";
import { EBottomNavBars } from "@/stateV2/bottomNavbars";
import BottomNavbar, { useToggleNavbarActivated } from "@/wechatComponents/BottomNavbar";
import Loading from "@/wechatComponents/Loading";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import MainSection from "./MainSection";

const Contacts = () => {
	useToggleNavbarActivated(EBottomNavBars.ADDRESS_BOOK);
	const { t } = useTranslation();

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
			<Suspense
				fallback={
					<div className="flex flex-1 items-center justify-center">
						<Loading className="h-8 w-8 text-wechatBrand-2" />
					</div>
				}
			>
				<MainSection />
			</Suspense>
			<BottomNavbar />
		</>
	);
};

export default Contacts;
