import { MOBILE_LIST, SCREEN_SIZE, deviceAtom } from "@/stateV2/device";
import { useSize } from "ahooks";
import { useAtomValue } from "jotai";

export default function useDeviceConfig() {
	const device = useAtomValue(deviceAtom);
	const size = useSize(() => document.querySelector("#center") || document.querySelector("#root"));
	let screenSize: {
		width: number;
		height: number;
	};
	if (device === MOBILE_LIST.AUTO) {
		const calculatedWidth = size ? size.width - 30 : 0;
		const calculatedHeight = size ? size.height - 140 : 0;
		screenSize = {
			width: calculatedWidth > 430 ? 430 : calculatedWidth,
			height: calculatedHeight > 932 ? 932 : calculatedHeight,
		};
	} else {
		screenSize = SCREEN_SIZE[device];
	}

	return {
		screenSize,
		device,
	};
}
