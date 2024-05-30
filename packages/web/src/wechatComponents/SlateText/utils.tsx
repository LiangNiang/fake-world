import type { BaseEditor, Descendant } from "slate";
import type { ReactEditor } from "slate-react";

export const withInlines = (editor: BaseEditor & ReactEditor) => {
	const { isInline, isVoid, markableVoid } = editor;
	editor.isInline = (element) => ["emoji"].includes(element.type) || isInline(element);
	editor.isVoid = (element) => ["emoji"].includes(element.type) || isVoid(element);
	editor.markableVoid = (element) => ["emoji"].includes(element.type) || markableVoid(element);

	return editor;
};

export const SLATE_INITIAL_VALUE: Descendant[] = [
	{
		type: "paragraph",
		children: [{ text: "" }],
	},
];

export const SLATE_EMPTY_VALUE = SLATE_INITIAL_VALUE;

import type { CSSProperties } from "react";

const EMOJI_IMAGE_WIDTH = 1221;

const EMOJI_IMAGE_SINGLE_ITEM_WIDTH = 89;

const BACKGROUND_SIZE = (EMOJI_IMAGE_WIDTH * 24) / EMOJI_IMAGE_SINGLE_ITEM_WIDTH;
const PRE_DEFINED_BASE_STYLE: { [key: string]: { panel: CSSProperties; preview: CSSProperties } } =
	{
		"3-4": {
			panel: {
				backgroundSize: BACKGROUND_SIZE,
				backgroundPositionX: "-174px",
				backgroundPositionY: "-127.1px",
				scale: "1.05",
			},
			preview: {
				backgroundSize: BACKGROUND_SIZE,
				backgroundPositionX: "-174px",
				backgroundPositionY: "-127.1px",
				scale: "0.95",
			},
		},
	};

const calculateEmojiStyle = (itemPos: { x: number; y: number }): {
	panel: CSSProperties;
	preview: CSSProperties;
} | null => {
	const { x, y } = itemPos;
	if (y === 13 && x >= 5) {
		return null;
	}
	if (PRE_DEFINED_BASE_STYLE[`${y}-${x}`]) {
		return PRE_DEFINED_BASE_STYLE[`${y}-${x}`];
	}
	const positionX = -6 - x * 42;
	const positionY = -9 - y * 38.8;
	return {
		panel: {
			backgroundSize: BACKGROUND_SIZE,
			backgroundPositionX: positionX,
			backgroundPositionY: positionY,
			scale: "1",
		},
		preview: {
			backgroundSize: BACKGROUND_SIZE,
			backgroundPositionX: positionX,
			backgroundPositionY: positionY,
			scale: "0.9",
		},
	};
};

export const EMOJI_ARRAY = ((x: number, y: number) => {
	const matrix: ReturnType<typeof calculateEmojiStyle>[][] = new Array(x);
	for (let i = 0; i < x; i++) {
		matrix[i] = new Array(y);
		for (let j = 0; j < y; j++) {
			matrix[i][j] = calculateEmojiStyle({ x: j, y: i });
		}
	}

	return matrix;
})(14, 8);
