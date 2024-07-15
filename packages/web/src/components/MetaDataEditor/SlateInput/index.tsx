import StickerOutlinedSVG from "@/assets/sticker-outlined.svg?react";
import EmojiList from "@/pages/wechat/conversation/ConversationFooter/EmojiPanel/EmojiList";
import { recentUsedEmojiAtom } from "@/stateV2/conversation";
import type { CustomElementEmoji } from "@/vite-env";
import Element from "@/wechatComponents/SlateText/Element";
import { withInlines } from "@/wechatComponents/SlateText/utils";
import { useCreation } from "ahooks";
import { Button, Popover } from "antd";
import { useSetAtom } from "jotai";
import { type MouseEvent, memo } from "react";
import { type Descendant, Transforms, createEditor } from "slate";
import { withHistory } from "slate-history";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";

type Props = {
	value?: Descendant[];
	onChange?: (value: Descendant[]) => void;
	inline?: boolean;
};

const WrapSlateInput = ({ value, onChange, inline }: Props) => {
	const setRecentUsedEmoji = useSetAtom(recentUsedEmojiAtom);
	const editor = useCreation(() => withInlines(withHistory(withReact(createEditor()))), []);
	if (!value) return null;

	const handleEmojiClick = (ev: MouseEvent) => {
		const emojiSymbol = (ev.target as HTMLDivElement).getAttribute("data-key");
		if (emojiSymbol) {
			ReactEditor.focus(editor);
			const emoji: CustomElementEmoji = { type: "emoji", emojiSymbol, children: [{ text: "" }] };
			Transforms.insertNodes(editor, emoji);
			Transforms.move(editor, { distance: 2 });
			setRecentUsedEmoji((prev) => Array.from(new Set([emojiSymbol, ...prev])).slice(0, 8));
		}
	};

	return (
		<div className="relative">
			<Slate
				editor={editor}
				onChange={(v) => {
					onChange?.(v);
				}}
				initialValue={value}
			>
				<Popover
					placement="bottomLeft"
					trigger="click"
					content={
						<EmojiList className="!px-0 !pb-0 w-80 bg-white" onEmojiClick={handleEmojiClick} />
					}
				>
					<Button
						icon={<StickerOutlinedSVG fill="black" className="h-5 w-5" />}
						type="text"
						className="-translate-y-1/2 absolute top-1/2 right-0 z-10"
					/>
				</Popover>
				<Editable
					renderElement={(props) => <Element {...props} />}
					onKeyDown={
						inline
							? (ev) => {
									if (ev.key === "Enter") {
										ev.preventDefault();
									}
								}
							: undefined
					}
					className="rounded border bg-white py-1 pr-7 pl-1 caret-wechatBrand-3 hover:border-antDaybreakBlue-5 focus:border-antDaybreakBlue-5 focus:shadow-[0_0_0_2px_rgba(5,145,255,0.1)] focus:outline-none"
				/>
			</Slate>
		</div>
	);
};

export default memo(WrapSlateInput, (pv, cv) => {
	if (pv.value === undefined && cv.value !== undefined) {
		return false;
	}
	return true;
});
