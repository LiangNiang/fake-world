import { EMetaDataType } from "@/stateV2/detectedNode";
import { statusBarAtom, statusBarConfigAtom, statusBarMountNodeAtom } from "@/stateV2/statusBar";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useInterval, useUpdate } from "ahooks";
import { Tooltip } from "antd";
import dayjs from "dayjs";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { twJoin } from "tailwind-merge";
import { canBeDetected } from "../NodeDetected";
import _5GSVG from "./assets/5G.svg?react";
import BatterySVG from "./assets/battery.svg?react";
import ChargingSVG from "./assets/charging.svg?react";
import ChargingDarkSVG from "./assets/chargingDark.svg?react";
import LowSVG from "./assets/low.svg?react";
import LowDarkSVG from "./assets/lowDark.svg?react";
import SavingSVG from "./assets/saving.svg?react";
import SavingDarkSVG from "./assets/savingDark.svg?react";
import Signal2SVG from "./assets/signal-2.svg?react";
import SignalSVG from "./assets/signal.svg?react";
import SignalNoneSVG from "./assets/signalNone.svg?react";
import WifiSVG from "./assets/wifi.svg?react";

const StatusBar = () => {
	const mountNode = useAtomValue(statusBarMountNodeAtom);
	const [{ backgroundColor, theme }, setStatusBar] = useAtom(statusBarAtom);
	const { hide, signalIconType, batteryIconType, networkIconType } =
		useAtomValue(statusBarConfigAtom);
	const update = useUpdate();
	const divRef = useRef<HTMLDivElement>(null);

	const darkTheme = theme === "dark";

	useInterval(() => {
		update();
	}, 1000);

	const fromSiblingNodeSetColor = (sibling: Element) => {
		if (mountNode !== null || !sibling) return;
		if (
			sibling.nextSibling === null &&
			document.querySelector("#screen")!.childElementCount === 2
		) {
			fromSiblingNodeSetColor(sibling.childNodes[0] as Element);
		} else {
			const color = getComputedStyle(sibling).backgroundColor;
			setStatusBar((pv) => ({
				...pv,
				backgroundColor: color,
			}));
		}
	};

	const mutationCallback = (mutations: MutationRecord[]) => {
		const myId = divRef.current?.id;
		if (!myId && mountNode !== null) return;
		let nextSibling: Element | undefined;
		for (const mr of mutations) {
			if (mr.type === "childList") {
				if (mr.addedNodes.length === 0) continue;
				for (const node of mr.addedNodes) {
					const previousSibling = node.previousSibling;
					if (previousSibling instanceof Element && previousSibling.id === myId) {
						nextSibling = node as Element;
						break;
					}
					if ((node as Element).id === myId) {
						nextSibling = node.nextSibling as Element;
						break;
					}
				}
			}
		}

		if (nextSibling) {
			fromSiblingNodeSetColor(nextSibling);
		}
	};

	useEffect(() => {
		const screen = document.querySelector("#screen");
		const observer = new MutationObserver(mutationCallback);
		observer.observe(screen!, {
			attributes: false,
			childList: true,
		});

		const nextSibling = divRef.current?.nextSibling;
		if (nextSibling && nextSibling instanceof Element) {
			fromSiblingNodeSetColor(nextSibling);
		}

		return () => {
			observer.disconnect();
		};
	}, []);

	const operations = useMemo(
		() => [
			{
				onClick: update,
				element: (
					<Tooltip title="同步当前时间">
						<ClockCircleOutlined />
					</Tooltip>
				),
			},
		],
		[],
	);

	const getBatteryIcon = () => {
		switch (batteryIconType) {
			case "charging":
				return darkTheme ? <ChargingDarkSVG /> : <ChargingSVG />;
			case "low":
				return darkTheme ? <LowDarkSVG /> : <LowSVG />;
			case "saving":
				return darkTheme ? <SavingDarkSVG /> : <SavingSVG />;
			default:
				return <BatterySVG className={twJoin(darkTheme ? "text-white" : "text-black")} />;
		}
	};

	const getNetworkIcon = () => {
		switch (networkIconType) {
			case "5G":
				return <_5GSVG fill={darkTheme ? "white" : "black"} />;
			default:
				return <WifiSVG fill={darkTheme ? "white" : "black"} />;
		}
	};

	const getSignalIcon = () => {
		switch (signalIconType) {
			case "double":
				return <Signal2SVG fill={darkTheme ? "white" : "black"} />;
			case "none":
				return <SignalNoneSVG fill={darkTheme ? "white" : "black"} />;
			default:
				return <SignalSVG fill={darkTheme ? "white" : "black"} />;
		}
	};

	const renderContent = (isMount?: boolean) => {
		return (
			<canBeDetected.div
				innerRef={divRef}
				className={twJoin(
					"flex items-center justify-between py-2 pr-6 pl-10",
					hide && "hidden",
					isMount && "pointer-events-auto z-10",
				)}
				metaData={{
					type: EMetaDataType.StatusBar,
					treeItemDisplayName: "状态栏",
					operations,
				}}
				style={{
					backgroundColor,
				}}
			>
				<div className={twJoin("font-semibold", darkTheme && "text-white")}>
					{dayjs().format("HH:mm")}
				</div>
				<div className="flex items-center space-x-2">
					{getSignalIcon()}
					{getNetworkIcon()}
					{getBatteryIcon()}
				</div>
			</canBeDetected.div>
		);
	};

	if (mountNode) {
		return createPortal(renderContent(true), mountNode);
	}

	return renderContent();
};

export default StatusBar;
