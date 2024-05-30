import { BrowserTypes } from "react-device-detect";

import { sleep } from "@/utils";

export function checkCanDirectCreateScreenshot({
	browserName,
	browserVersion,
}: { browserName: string; browserVersion: string }) {
	const majorVersion = Number.parseInt(browserVersion ?? "", 10);
	let errorText: string | undefined;

	switch (browserName) {
		case BrowserTypes.EdgeChromium:
		case BrowserTypes.Edge:
			if (majorVersion < 94) {
				errorText = "请升级到新版本的 Edge 浏览器";
			}
			break;
		case BrowserTypes.Chromium:
		case BrowserTypes.Chrome:
			if (majorVersion < 104) {
				errorText = "请升级到 Chrome > 104 或更高版本";
			}
			break;
		case BrowserTypes.Opera:
			if (majorVersion < 90) {
				errorText = "请升级到 Opera > 90 或更高版本";
			}
			break;
		default:
			errorText = "您的浏览器不支持直接创建截图，请使用新版的 Edge、Chrome 或 Opera 浏览器";
	}
	if (errorText) throw new Error(errorText);
}

export async function drawToCanvas(stream: MediaStream) {
	const canvas = document.createElement("canvas");
	const video = document.createElement("video");
	video.srcObject = stream;

	await sleep(500);

	await video.play();

	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;
	canvas.getContext("2d")!.drawImage(video, 0, 0);

	return canvas;
}
