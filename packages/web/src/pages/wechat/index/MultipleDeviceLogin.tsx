import AppleWatchOutlinedSVG from "@/assets/apple-watch-outlined.svg?react";
import MultipleDeviceSVG from "@/assets/display-mobile-outlined.svg?react";
import DisplayOutlinedSVG from "@/assets/display-outlined.svg?react";
import IMacOutlinedSVG from "@/assets/imac-outlined.svg?react";
import PadOutlined from "@/assets/pad-outlined.svg?react";
import { canBeDetected } from "@/components/NodeDetected";
import { MetaDataType } from "@/state/detectedNode";
import { type ALL_LOGIN_DEVICES, multipleDeviceLoginAtom } from "@/stateV2/multipleDeviceLogin";
import { useAtomValue } from "jotai";
import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { twJoin } from "tailwind-merge";

const MultipleDeviceLogin = () => {
	const { visible, devices } = useAtomValue(multipleDeviceLoginAtom);
	const { t } = useTranslation();

	const show = visible && devices.length > 0;

	const DEVICE_RENDER_CONFIG: Record<
		(typeof ALL_LOGIN_DEVICES)[number],
		{
			icon: ReactElement;
			text: string;
		}
	> = {
		iPad: {
			icon: <PadOutlined fill="rgba(0, 0, 0, 0.7)" width={20} height={20} />,
			text: t("wechatPage.main.iPadLogin"),
		},
		Mac: {
			icon: <IMacOutlinedSVG fill="rgba(0, 0, 0, 0.7)" width={20} height={20} />,
			text: t("wechatPage.main.macLogin"),
		},
		Windows: {
			icon: <DisplayOutlinedSVG fill="rgba(0, 0, 0, 0.7)" width={20} height={20} />,
			text: t("wechatPage.main.windowsLogin"),
		},
		Desktop: {
			icon: <DisplayOutlinedSVG fill="rgba(0, 0, 0, 0.7)" width={20} height={20} />,
			text: t("wechatPage.main.desktopLogin"),
		},
		Watch: {
			icon: <AppleWatchOutlinedSVG fill="rgba(0, 0, 0, 0.7)" width={20} height={20} />,
			text: t("wechatPage.main.watchLogin"),
		},
	};

	const renderDevice = () => {
		if (!show) return null;
		const { icon, text } = DEVICE_RENDER_CONFIG[devices[0]];
		return (
			<>
				{icon}
				<span className="ml-5 text-black/60">{text}</span>
			</>
		);
	};

	return (
		<canBeDetected.div
			className={twJoin(
				"flex items-center border-black/5 border-b bg-[rgba(237,237,237,1)] px-7 pt-3 pb-2 text-sm",
				show ? "visible" : "hidden",
			)}
			metaData={{
				type: MetaDataType.MultipleDeviceLogin,
				treeItemDisplayName: (d) => `多设备登录显示，目前${d.devices.length}个设备`,
			}}
		>
			{devices.length > 1 ? (
				<>
					<MultipleDeviceSVG fill="rgba(0, 0, 0, 0.7)" width={20} height={20} />
					<span className="ml-5 text-black/60">
						{t("wechatPage.main.multipleLogin", {
							number: devices.length,
						})}
					</span>
				</>
			) : (
				renderDevice()
			)}
		</canBeDetected.div>
	);
};

export default MultipleDeviceLogin;
