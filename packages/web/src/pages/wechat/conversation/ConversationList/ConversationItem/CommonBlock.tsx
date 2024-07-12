import { h } from "@/components/HashAssets";
import useModeNavigate from "@/components/useModeNavigate";
import type { IConversationItemBase } from "@/state/conversationState";
import { type IProfile, friendState } from "@/state/profile";
import { getModeValueSnapshot } from "@/stateV2/mode";
import { css } from "@emotion/react";
import { useDebounceFn } from "ahooks";
import type {
	CSSProperties,
	ComponentType,
	MouseEventHandler,
	PropsWithChildren,
	ReactNode,
} from "react";
import { useRecoilValue } from "recoil";
import { twJoin, twMerge } from "tailwind-merge";
import { useConversationAPI } from "../../context";

interface Props<P = AnyObject> {
	upperText: IConversationItemBase["upperText"];
	senderId: IProfile["id"];
	innerBlockClassName?: string;
	blockClassName?: string;
	blockStyle?: CSSProperties;
	extraElement?: ReactNode;
	hideAvatar?: boolean;
	innerBlockComponent?: ComponentType<P> | string;
	innerBlockProps?: P;
	onClick?: MouseEventHandler<HTMLDivElement>;
}

const CommonBlock = <P extends AnyObject>({
	upperText,
	senderId,
	children,
	innerBlockClassName,
	blockClassName,
	blockStyle,
	extraElement,
	hideAvatar,
	innerBlockComponent: InnerBlockComponent = "div",
	innerBlockProps,
	onClick,
}: PropsWithChildren<Props<P>>) => {
	const { avatarInfo } = useRecoilValue(friendState(senderId));
	const navigate = useModeNavigate({ silence: true });
	const { sendTickleText } = useConversationAPI();

	const handleClick: MouseEventHandler<HTMLImageElement> = (ev) => {
		const { detail: count } = ev;
		if (count === 2) {
			handleDoubliClick();
		} else if (count === 1) {
			navigate(`/wechat/friend/${senderId}`);
		}
	};

	const handleDoubliClick = () => {
		if (getModeValueSnapshot() === "edit") return;
		sendTickleText(senderId);
	};

	const { run: debouncedHandleClick } = useDebounceFn(handleClick, { wait: 200 });

	return (
		<>
			{upperText && <div className="m-auto text-black/50 text-xs">{upperText}</div>}
			<div
				className={twMerge(
					"relative flex max-w-[85%] space-x-3 group-[.mine]:ml-auto group-[.mine]:flex-row-reverse group-[.mine]:space-x-reverse",
					blockClassName,
				)}
				style={blockStyle}
				onClick={onClick}
			>
				<h.img
					src={avatarInfo}
					className={twJoin(
						"h-10 w-10 min-w-10 cursor-pointer rounded object-cover object-center",
						hideAvatar && "invisible",
					)}
					onClick={debouncedHandleClick}
				/>
				<InnerBlockComponent
					css={css`
            &::before {
              clip-path: polygon(0% 50%, 50% 100%, 0% 100%);
            }
          `}
					className={twMerge(
						"group-[.friend]:before:-left-[1px] group-[.mine]:before:-right-[1px] group-[.mine]:before:-rotate-[135deg] relative max-w-[85%] break-words rounded p-[10px] before:absolute before:top-[6px] before:h-7 before:w-7 group-[.friend]:before:rotate-45 before:rounded-sm",
						innerBlockClassName,
					)}
					{...(innerBlockProps as P)}
				>
					{children}
				</InnerBlockComponent>
				{extraElement}
			</div>
		</>
	);
};

export default CommonBlock;
