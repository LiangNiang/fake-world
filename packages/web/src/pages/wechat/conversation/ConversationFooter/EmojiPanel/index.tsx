import LikeOutlinedSVG from "@/assets/like-outlined.svg?react";
import SearchOutlinedSVG from "@/assets/search-outlined.svg?react";
import SELFIE_EXPRESSION_IMG from "@/assets/selfie-expression.png";
import StickerOutlinedSVG from "@/assets/sticker-outlined.svg?react";
import { inputterValueAtom } from "@/stateV2/conversation";
import { SLATE_INITIAL_VALUE } from "@/wechatComponents/SlateText/utils";
import { useAtom } from "jotai";
import { isEqual } from "lodash-es";
import { type MouseEvent as ReactMouseEvent, useCallback, useEffect, useRef } from "react";
import { useConversationAPI } from "../../context";
import { usePopup } from "../BottomPopup";
import EmojiList from "./EmojiList";
import FloatingButtons from "./FloatingButtons";

const EmojiPanel = () => {
	const { enteringStatusCallback, exitedStatusCallback, nodeRef } = usePopup();
	const { insertEmojiNode, scrollConversationListToBtm, focusInput, setMobileInputMode } =
		useConversationAPI();
	const value = useAtom(inputterValueAtom);
	const previousTouch = useRef<Touch | null>(null);
	const isInitial = isEqual(value, SLATE_INITIAL_VALUE);

	useEffect(() => {
		const onEnter = () => {
			scrollConversationListToBtm();
			setMobileInputMode("none");
		};
		const rmEnteredCB = enteringStatusCallback.setCallback(onEnter);
		const rmExitedCB = exitedStatusCallback.setCallback(focusInput);

		return () => {
			rmEnteredCB();
			rmExitedCB();
		};
	});

	const handler = useCallback((ev: MouseEvent | TouchEvent) => {
		ev.preventDefault();
		const height = nodeRef.current!.offsetHeight;
		let movementY: number;
		if (ev instanceof MouseEvent) {
			movementY = ev.movementY;
		} else if (ev instanceof TouchEvent) {
			const touch = ev.touches[0];
			if (previousTouch.current) {
				movementY = touch.pageY - previousTouch.current.pageY;
			}
			previousTouch.current = touch;
		}
		const res = height - movementY!;
		if (res <= 600 && res >= 350) {
			nodeRef.current!.style.height = `${res}px`;
		}
	}, []);

	const handleMouseDown = () => {
		const screen = document.getElementById("screen")!;
		screen.addEventListener("mousemove", handler);
		screen.addEventListener("mouseup", handleMouseUp);
	};

	const handleMouseUp = useCallback(() => {
		const screen = document.getElementById("screen")!;
		screen.removeEventListener("mousemove", handler);
		screen.removeEventListener("mouseup", handleMouseUp);
	}, []);

	const handleTouchStart = () => {
		const screen = document.getElementById("screen")!;
		screen.addEventListener("touchmove", handler);
		screen.addEventListener("touchend", handleTouchEnd);
	};

	const handleTouchEnd = useCallback(() => {
		const screen = document.getElementById("screen")!;
		screen.removeEventListener("touchmove", handler);
		screen.removeEventListener("touchend", handleTouchEnd);
		previousTouch.current = null;
	}, []);

	const handleEmojiClick = (ev: ReactMouseEvent) => {
		const emojiSymbol = (ev.target as HTMLDivElement).getAttribute("data-key");
		if (emojiSymbol) {
			insertEmojiNode(emojiSymbol);
		}
	};

	return (
		<div className="flex max-h-full select-none flex-col">
			<div className="flex items-center space-x-[10px] bg-[#F6F6F6] px-4 py-[6px]">
				<div className="cursor-pointer rounded p-[6px]">
					<SearchOutlinedSVG className="h-6 w-6" fill="black" />
				</div>
				<div className="cursor-pointer rounded bg-white p-[6px]">
					<StickerOutlinedSVG className="h-6 w-6" fill="black" />
				</div>
				<div className="cursor-pointer rounded p-[6px]">
					<LikeOutlinedSVG className="h-6 w-6" fill="black" />
				</div>
				<div className="cursor-pointer rounded p-[6px]">
					<img src={SELFIE_EXPRESSION_IMG} className="h-6 w-6 origin-center scale-90" />
				</div>
			</div>
			<div
				className="flex w-full cursor-row-resize justify-center bg-[#ECECEC]"
				onMouseDown={handleMouseDown}
				onTouchStart={handleTouchStart}
			>
				<div className="py-3">
					<div className="h-1 w-12 rounded bg-[#D1CFD0]" />
				</div>
			</div>
			<EmojiList onEmojiClick={handleEmojiClick} />
			<FloatingButtons disabled={isInitial} />
		</div>
	);
};

export default EmojiPanel;
