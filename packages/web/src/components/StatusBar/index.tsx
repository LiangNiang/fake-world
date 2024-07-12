import { MetaDataType } from "@/state/detectedNode";
import { statusBarAtom, statusBarHideAtom, statusBarMountNodeAtom } from "@/stateV2/statusBar";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useInterval, useUpdate } from "ahooks";
import { Tooltip } from "antd";
import dayjs from "dayjs";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { twJoin } from "tailwind-merge";
import { canBeDetected } from "../NodeDetected";
import BatterySVG from "./assets/battery.svg?react";
import SingalSVG from "./assets/singal.svg?react";
import WifiSVG from "./assets/wifi.svg?react";

const StatusBar = () => {
	const mountNode = useAtomValue(statusBarMountNodeAtom);
	const [{ backgroundColor, theme }, setStatusBar] = useAtom(statusBarAtom);
	const hidden = useAtomValue(statusBarHideAtom);
	const update = useUpdate();
	const divRef = useRef<HTMLDivElement>(null);

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

	const renderContent = (isMount?: boolean) => {
		const useWhiteColorText = theme === "dark";

		return (
			<canBeDetected.div
				innerRef={divRef}
				className={twJoin(
					"flex items-center justify-between py-2 pr-6 pl-10",
					hidden && "hidden",
					isMount && "pointer-events-auto z-10",
				)}
				metaData={{
					type: MetaDataType.StatusBar,
					treeItemDisplayName: "状态栏",
					operations: [
						{
							onClick: update,
							element: (
								<Tooltip title="同步当前时间">
									<ClockCircleOutlined />
								</Tooltip>
							),
						},
					],
				}}
				style={{
					backgroundColor,
				}}
			>
				<div className={twJoin("font-semibold", useWhiteColorText && "text-white")}>
					{dayjs().format("HH:mm")}
				</div>
				<div className="flex items-center space-x-2">
					<SingalSVG fill={useWhiteColorText ? "white" : "black"} />
					<WifiSVG fill={useWhiteColorText ? "white" : "black"} />
					{/* 这里svg每个path使用了currentcolor，不能设置为 fill 会导致样式异常 */}
					<BatterySVG className={twJoin(useWhiteColorText ? "text-white" : "text-black")} />
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
