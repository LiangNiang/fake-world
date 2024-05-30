import { omit } from "lodash-es";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { twJoin, twMerge } from "tailwind-merge";

import ArrowOutlinedSVG from "@/assets/arrow-outlined.svg?react";
import { canBeDetected } from "@/components/NodeDetected";

type ListItemProps = {
	withJump?: boolean;
	icon?: ReactNode;
	textPrev?: ReactNode;
	textPrevClassName?: string;
	rightClassName?: string;
};

export const List = ({ children, className }: ComponentPropsWithRef<"div">) => {
	return <div className={twJoin("flex flex-col bg-white", className)}>{children}</div>;
};

const ListItemPrev = ({ children, className }: ComponentPropsWithRef<"div">) => {
	return <div className={twMerge("ml-3", className)}>{children}</div>;
};

export const ListItem = ({
	children,
	className,
	withJump,
	icon,
	textPrev,
	textPrevClassName,
	rightClassName,
	...rest
}: ComponentPropsWithRef<"div"> & ListItemProps) => {
	const renderTextPrevNode = () => {
		if (icon) {
			return (
				<ListItemPrev className="mr-4 flex h-6 w-6 items-center justify-center">
					{icon}
				</ListItemPrev>
			);
		}
		if (textPrev) {
			return <ListItemPrev className={textPrevClassName}>{textPrev}</ListItemPrev>;
		}
		return <ListItemPrev />;
	};

	return (
		<div
			className={twMerge(
				"group/item relative flex items-center",
				(withJump || rest.onClick) && "cursor-pointer",
				className,
			)}
			{...omit(rest, "className", "children")}
		>
			{renderTextPrevNode()}
			<div
				className={twMerge(
					"relative flex flex-1 items-center border-black/5 border-b py-3 pr-3 group-last/item:border-none",
					rightClassName,
				)}
			>
				<div className="flex-1">{children}</div>
				<div className="ml-auto">
					{withJump && <ArrowOutlinedSVG fill="rgba(0,0,0,0.3)" className="ml-1 w-[18px]" />}
				</div>
			</div>
		</div>
	);
};

List.Item = ListItem;
List.CanBeDetectedItem = canBeDetected(ListItem);

export default List;
