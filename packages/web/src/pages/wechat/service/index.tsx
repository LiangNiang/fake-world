import BackFilledSVG from "@/assets/back-filled.svg?react";
import MoreFilledSVG from "@/assets/more-filled.svg?react";
import PayVendorSVG from "@/assets/pay-vendor.svg?react";
import WalletOutlinedSVG from "@/assets/wallet-outlined.svg?react";
import { canBeDetected } from "@/components/NodeDetected";
import useModeNavigate from "@/components/useModeNavigate";
import { MetaDataType } from "@/state/detectedNode";
import { walletAtom } from "@/stateV2/wallet";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import BKZF_SVG from "./assets/bkzf.svg?react";
import BXFW_SVG from "./assets/bxfw.svg?react";
import CSFW_SVG from "./assets/csfw.svg?react";
import CXFW_SVG from "./assets/cxfw.svg?react";
import DDCX_SVG from "./assets/ddcx.svg?react";
import DYYCYL_SVG from "./assets/dyycyl.svg?react";
import HCPJP_SVG from "./assets/hcpjp.svg?react";
import JD_SVG from "./assets/jd.svg?react";
import JDGW_SVG from "./assets/jdgw.svg?react";
import LCT_SVG from "./assets/lct.svg?react";
import MTTJ_SVG from "./assets/mttj.svg?react";
import MTWM_SVG from "./assets/mtwm.svg?react";
import PDD_SVG from "./assets/pdd.svg?react";
import PPFX_SVG from "./assets/ppfx.svg?react";
import QBCZ_SVG from "./assets/qbcz.svg?react";
import SHJF_SVG from "./assets/shjf.svg?react";
import SJCZ_SVG from "./assets/sjcz.svg?react";
import TXGY_SVG from "./assets/txgy.svg?react";
import WPHTM_SVG from "./assets/wphtm.svg?react";
import XYKHK_SVG from "./assets/xykhk.svg?react";
import YLJK_SVG from "./assets/yljk.svg?react";
import ZZES_SVG from "./assets/zzes.svg?react";

const Service = () => {
	const navigate = useModeNavigate();
	const { balance } = useAtomValue(walletAtom);
	const { t } = useTranslation();

	return (
		<>
			<div className="grid grid-cols-3 bg-[rgba(237,237,237,1)] px-4 py-2">
				<BackFilledSVG
					fill="black"
					className="h-5 w-5 cursor-pointer"
					onClick={() => navigate("/wechat/my")}
				/>
				<div className="flex items-center justify-center font-medium">
					{t("wechatPage.services.title")}
				</div>
				<div className="flex items-center justify-end">
					<MoreFilledSVG fill="black" className="h-5 w-5" />
				</div>
			</div>
			<div className="overflow-auto bg-[rgba(237,237,237,1)] px-1 pb-10">
				<canBeDetected.div
					className="mt-1 flex items-center justify-between rounded-md bg-wechatBrand-2 px-20 py-10"
					metaData={{
						type: MetaDataType.Wallet,
						treeItemDisplayName: (data) => `钱包（余额：¥${data.balance}）`,
					}}
				>
					<div className="flex cursor-pointer flex-col items-center">
						<PayVendorSVG fill="white" className="h-9 w-9" />
						<div className="mt-1 font-medium text-white">{t("wechatPage.services.money")}</div>
					</div>
					<div
						className="relative flex cursor-pointer flex-col items-center"
						onClick={() => navigate("/wechat/wallet")}
					>
						<WalletOutlinedSVG fill="white" className="h-9 w-9" />
						<div className="mt-1 font-medium text-white">{t("wechatPage.services.wallet")}</div>
						<div className="-bottom-[22px] absolute text-sm text-white/40">¥{balance}</div>
					</div>
				</canBeDetected.div>
				<div className="mt-2 flex flex-col rounded-md bg-white p-3">
					<div className="text-black/50 text-xs">{t("wechatPage.services.financialServices")}</div>
					<div className="my-6 grid grid-cols-4 gap-x-1">
						<div className="flex cursor-pointer flex-col items-center">
							<XYKHK_SVG className="h-6 w-6" fill="#3CC15F" />
							<span className="mt-2 text-black/80 text-sm">
								{t("wechatPage.services.cardRepay")}
							</span>
						</div>
						<div className="flex cursor-pointer flex-col items-center">
							<LCT_SVG className="h-6 w-6" fill="#3CADFF" />
							<span className="mt-2 text-black/80 text-sm">{t("wechatPage.services.wealth")}</span>
						</div>
						<div className="flex cursor-pointer flex-col items-center">
							<BXFW_SVG className="h-6 w-6" fill="#F79C3E" />
							<span className="mt-2 text-black/80 text-sm">
								{t("wechatPage.services.insurance")}
							</span>
						</div>
					</div>
				</div>
				<div className="mt-2 flex flex-col rounded-md bg-white p-3">
					<div className="text-black/50 text-xs">{t("wechatPage.services.dailyServices")}</div>
					<div className="my-6 grid grid-cols-4 gap-x-1 gap-y-8">
						<div className="flex cursor-pointer flex-col items-center">
							<SJCZ_SVG className="h-6 w-6" fill="#2F84EF" />
							<span className="mt-2 text-center text-black/80 text-sm">
								{t("wechatPage.services.mobile")}
							</span>
						</div>
						<div className="flex cursor-pointer flex-col items-center">
							<SHJF_SVG className="h-6 w-6" fill="#3CC15F" />
							<span className="mt-2 text-black/80 text-sm">
								{t("wechatPage.services.utilities")}
							</span>
						</div>
						<div className="flex cursor-pointer flex-col items-center">
							<QBCZ_SVG className="h-6 w-6" fill="#3DAFFF" />
							<span className="mt-2 text-black/80 text-sm">{t("wechatPage.services.qqCoin")}</span>
						</div>
						<div className="flex cursor-pointer flex-col items-center">
							<CSFW_SVG className="h-6 w-6" fill="#39B862" />
							<span className="mt-2 text-center text-black/80 text-sm">
								{t("wechatPage.services.public")}
							</span>
						</div>
						<div className="flex cursor-pointer flex-col items-center">
							<TXGY_SVG className="h-6 w-6" fill="#F55251" />
							<span className="mt-2 text-center text-black/80 text-sm">
								{t("wechatPage.services.charity")}
							</span>
						</div>
						<div className="flex cursor-pointer flex-col items-center">
							<YLJK_SVG className="h-6 w-6" fill="#F79F3E" />
							<span className="mt-2 text-black/80 text-sm">{t("wechatPage.services.health")}</span>
						</div>
					</div>
				</div>
				<div className="mt-2 flex flex-col rounded-md bg-white p-3">
					<div className="text-black/50 text-xs">{t("wechatPage.services.travel")}</div>
					<div className="my-6 grid grid-cols-4 gap-x-1 gap-y-8">
						<div className="flex cursor-pointer flex-col items-center">
							<CXFW_SVG className="h-6 w-6" fill="#3DB0FF" />
							<span className="mt-2 text-black/80 text-sm">
								{t("wechatPage.services.mobility")}
							</span>
						</div>
						<div className="flex cursor-pointer flex-col items-center">
							<HCPJP_SVG className="h-6 w-6" fill="#3BBE5C" />
							<span className="mt-2 text-center text-black/80 text-sm">
								{t("wechatPage.services.r&f")}
							</span>
						</div>
						<div className="flex cursor-pointer flex-col items-center">
							<DDCX_SVG className="h-6 w-6" fill="#F79D3D" />
							<span className="mt-2 text-black/80 text-sm">{t("wechatPage.services.didi")}</span>
						</div>
						<div className="flex cursor-pointer flex-col items-center">
							<JD_SVG className="h-6 w-6" fill="#3CBF62" />
							<span className="mt-2 text-black/80 text-sm">{t("wechatPage.services.hotels")}</span>
						</div>
					</div>
				</div>
				<div className="mt-2 flex flex-col rounded-md bg-white p-3">
					<div className="text-black/50 text-xs">{t("wechatPage.services.shopping")}</div>
					<div className="my-6 grid grid-cols-4 gap-x-1 gap-y-8">
						<div className="flex cursor-pointer flex-col items-center">
							<PPFX_SVG className="h-6 w-6" fill="#F5534E" />
							<span className="mt-2 text-black/80 text-sm">
								{t("wechatPage.services.brandMall")}
							</span>
						</div>
						<div className="flex cursor-pointer flex-col items-center">
							<JDGW_SVG className="h-6 w-6" fill="#F55352" />
							<span className="mt-2 text-black/80 text-sm">{t("wechatPage.services.jd")}</span>
						</div>
						<div className="flex cursor-pointer flex-col items-center">
							<MTWM_SVG className="h-6 w-6" fill="#F89E3B" />
							<span className="mt-2 text-center text-black/80 text-sm">
								{t("wechatPage.services.meituan")}
							</span>
						</div>
						<div className="flex cursor-pointer flex-col items-center">
							<DYYCYL_SVG className="h-6 w-6" fill="#F55151" />
							<span className="mt-2 text-center text-black/80 text-sm">
								{t("wechatPage.services.eventTickets")}
							</span>
						</div>
						<div className="flex cursor-pointer flex-col items-center">
							<MTTJ_SVG className="h-6 w-6" fill="#F89E3B" />
							<span className="mt-2 text-center text-black/80 text-sm">
								{t("wechatPage.services.meituan2")}
							</span>
						</div>
						<div className="flex cursor-pointer flex-col items-center">
							<PDD_SVG className="h-6 w-6" fill="#F54F55" />
							<span className="mt-2 text-center text-black/80 text-sm">
								{t("wechatPage.services.pdd")}
							</span>
						</div>
						<div className="flex cursor-pointer flex-col items-center">
							<WPHTM_SVG className="h-6 w-6" fill="#DC5889" />
							<span className="mt-2 text-black/80 text-sm">{t("wechatPage.services.wph")}</span>
						</div>
						<div className="flex cursor-pointer flex-col items-center">
							<ZZES_SVG className="h-6 w-6" fill="#F55252" />
							<span className="mt-2 text-black/80 text-sm">{t("wechatPage.services.zz")}</span>
						</div>
						<div className="flex cursor-pointer flex-col items-center">
							<BKZF_SVG className="h-6 w-6" fill="#3CADFD" />
							<span className="mt-2 text-black/80 text-sm">{t("wechatPage.services.bk")}</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Service;
