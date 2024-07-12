import useDeviceConfig from "@/components/useDeviceConfig";
import { modeAtom } from "@/stateV2/mode";
import { sleep } from "@/utils";
import { CameraOutlined } from "@ant-design/icons";
import { App, Button, type ButtonProps } from "antd";
import { saveAs } from "file-saver";
import { useSetAtom } from "jotai";
import { noop } from "lodash-es";
import { browserName, browserVersion } from "react-device-detect";
import { checkCanDirectCreateScreenshot, drawToCanvas } from "./utils";

type Props = {
	buttonProps?: ButtonProps;
};

const ScreenshotButton = ({ buttonProps }: Props) => {
	const { message } = App.useApp();
	const { screenSize } = useDeviceConfig();
	const setMode = useSetAtom(modeAtom);

	const handleCreateScreenshot = async () => {
		setMode("preview");
		try {
			checkCanDirectCreateScreenshot({
				browserName,
				browserVersion,
			});
		} catch (e: any) {
			message.error(e?.message);
		}
		const stream = await navigator.mediaDevices
			.getDisplayMedia({
				video: true,
				audio: false,
				preferCurrentTab: true,
			})
			.catch(noop);
		if (!stream) return;
		await sleep(700);
		const screenElement = document.querySelector("#screen") as HTMLDivElement;
		const innerHeight = window.innerHeight;
		if (innerHeight < screenSize.height) {
			screenElement.style.height = `${innerHeight}px`;
		}
		const [videoTrack] = stream.getVideoTracks();
		const cropTarget = await CropTarget.fromElement(screenElement);
		await videoTrack.cropTo(cropTarget);
		const canvas = await drawToCanvas(stream);
		console.log(canvas);
		canvas.toBlob((blob) => {
			saveAs(blob!, "screenshot.png");
			videoTrack.stop();
			location.reload();
		});
	};

	return <Button onClick={handleCreateScreenshot} icon={<CameraOutlined />} {...buttonProps} />;
};

export default ScreenshotButton;
