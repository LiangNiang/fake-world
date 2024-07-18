import { recentUsedEmojiAtom } from "@/stateV2/conversation";
import { EMOJI_ARRAY } from "@/wechatComponents/SlateText/utils";
import { useAtomValue } from "jotai";
import { type MouseEvent, useMemo } from "react";
import { twJoin } from "tailwind-merge";

type Props = {
	onEmojiClick: (ev: MouseEvent) => void;
	className?: string;
};

const EmojiList = ({ onEmojiClick, className }: Props) => {
	const recentUsedEmoji = useAtomValue(recentUsedEmojiAtom);

	const recentUseEmojiContent = useMemo(() => {
		if (recentUsedEmoji.length === 0) return null;
		return (
			<div className="flex flex-col">
				<div className="mb-4 text-xs">最近使用</div>
				<div className="flex justify-between" onClick={onEmojiClick}>
					{recentUsedEmoji.map((item) => {
						const [y, x] = item.split("-").map((i) => Number.parseInt(i));
						return (
							<div
								key={`${y}-${x}`}
								data-key={`${y}-${x}`}
								className="h-6 w-6 origin-center cursor-pointer bg-no-repeat"
								style={{
									backgroundImage:
										"url(https://cdn-fakeworld.azureedge.net/fakeworld/emoji-sprite.png)",
									...EMOJI_ARRAY[y][x]!.panel,
								}}
							/>
						);
					})}
					{new Array(8 - recentUsedEmoji.length).fill(0).map((_, i) => (
						<div key={`empty-${i}`} className="h-6 w-6" />
					))}
				</div>
			</div>
		);
	}, [recentUsedEmoji]);

	return (
		<div className={twJoin("flex flex-col overflow-auto bg-[#ECECEC] px-4 pb-8", className)}>
			{recentUseEmojiContent}
			<div className="my-4 text-xs">所有表情</div>
			<div className="flex flex-col space-y-4" onClick={onEmojiClick}>
				{EMOJI_ARRAY.map((y, yi) => {
					return (
						<div className="flex justify-between" key={`y-${yi}`}>
							{y.map((style, xi) => {
								return (
									<div
										key={`${yi}-${xi}`}
										data-key={style ? `${yi}-${xi}` : null}
										className={twJoin(
											"h-6 w-6 origin-center bg-inherit bg-no-repeat",
											style && "cursor-pointer",
										)}
										style={{
											backgroundImage: style
												? "url(https://cdn-fakeworld.azureedge.net/fakeworld/emoji-sprite.png)"
												: undefined,
											...style?.panel,
										}}
									/>
								);
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default EmojiList;
