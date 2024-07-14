import BackFilledSVG from "@/assets/back-filled.svg?react";
import CoinOutlinedSVG from "@/assets/coin-outlined.svg?react";
import PayCardsOutlinedSVG from "@/assets/pay-cards-outlined.svg?react";
import PayMiniFundOutlinedSVG from "@/assets/pay-mini-fund-outlined.svg?react";
import PayRelativeCardsSVG from "@/assets/pay-relative-cards.svg?react";
import useModeNavigate from "@/components/useModeNavigate";
import { EMetaDataType } from "@/stateV2/detectedNode";
import { walletAtom } from "@/stateV2/wallet";
import List from "@/wechatComponents/List";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import SZRMB_SVG from "./assets/szrmb.svg?react";
import XFZBH_SVG from "./assets/xfzbh.svg?react";
import ZFF_SVG from "./assets/zff.svg?react";

const Wallet = () => {
	const navigate = useModeNavigate();
	const { balance, miniFund, miniFundYield } = useAtomValue(walletAtom);
	const { t } = useTranslation();

	return (
		<>
			<div className="grid grid-cols-3 bg-[rgba(237,237,237,1)] px-4 py-2">
				<BackFilledSVG
					fill="black"
					className="h-5 w-5 cursor-pointer"
					onClick={() => navigate("/wechat/service")}
				/>
				<div className="flex items-center justify-center font-medium">
					{t("wechatPage.wallet.title")}
				</div>
				<div className="flex items-center justify-end">{t("wechatPage.wallet.transactions")}</div>
			</div>
			<div className="flex flex-1 flex-col overflow-auto bg-[rgba(237,237,237,1)]">
				<List>
					<List.CanBeDetectedItem
						withJump
						icon={<CoinOutlinedSVG fill="#FFC300" />}
						onClick={() => navigate("/wechat/wallet/balance")}
						metaData={{
							type: EMetaDataType.Wallet,
							treeItemDisplayName: (data) => `零钱余额：¥${data.balance}`,
						}}
					>
						<div className="flex items-center justify-between">
							<div>{t("wechatPage.wallet.balance")}</div>
							<div className="text-sm">¥{balance}</div>
						</div>
					</List.CanBeDetectedItem>
					<List.CanBeDetectedItem
						withJump
						icon={<PayMiniFundOutlinedSVG fill="#FFC300" />}
						metaData={{
							type: EMetaDataType.Wallet,
							treeItemDisplayName: (data) => `零钱通余额：¥${data.miniFund}`,
						}}
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<div>{t("wechatPage.wallet.mf")}</div>
								<div className="ml-2 rounded-sm bg-wechatOrange-5 px-1 text-wechatOrange-3 text-xs">
									{t("wechatPage.wallet.yield")}
									{miniFundYield}%
								</div>
							</div>
							<div className="text-sm">¥{miniFund}</div>
						</div>
					</List.CanBeDetectedItem>
					<List.Item withJump icon={<PayCardsOutlinedSVG fill="#2A7FCB" />}>
						{t("wechatPage.wallet.cards")}
					</List.Item>
					<List.Item withJump icon={<PayRelativeCardsSVG className="h-6 w-6" fill="#FA9D3B" />}>
						{t("wechatPage.wallet.relativeCard")}
					</List.Item>
				</List>
				<List className="mt-1.5">
					<List.Item withJump icon={<SZRMB_SVG fill="#BB2938" className="h-5 w-5" />}>
						{t("wechatPage.wallet.eCNY")}
					</List.Item>
				</List>
				<List className="mt-1.5">
					<List.Item withJump icon={<ZFF_SVG fill="#58C17E" className="h-5 w-5" />}>
						{t("wechatPage.wallet.payScore")}
					</List.Item>
				</List>
				<List className="mt-1.5">
					<List.Item withJump icon={<XFZBH_SVG fill="#58C17E" className="h-5 w-5" />}>
						{t("wechatPage.wallet.protection")}
					</List.Item>
				</List>

				<div className="absolute bottom-12 flex w-full items-center justify-center space-x-2 text-center text-sm text-wechatLink-2">
					<div>{t("wechatPage.wallet.idInfo")}</div>
					<div className="h-5 w-[1px] bg-slate-300" />
					<div>{t("wechatPage.wallet.settings")}</div>
				</div>
			</div>
		</>
	);
};

export default Wallet;
