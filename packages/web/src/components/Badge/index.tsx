import { isNil } from "lodash-es";
import type { CSSProperties, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
	type?: "number" | "dot";
	className?: string;
	text?: number;
	style?: CSSProperties;
	hidden?: boolean;
};

const Badge = ({
	type = "number",
	style,
	text,
	className,
	children,
	hidden,
}: PropsWithChildren<Props>) => {
	if (hidden || (isNil(text) && type === "number")) {
		return <>{children}</>;
	}
	const isOneText = text?.toString().length === 1;
	return (
		<div className="relative">
			{children}
			{type === "dot" && (
				<div
					className={twMerge(
						"-right-1 -top-1 absolute h-[10px] w-[10px] rounded-full bg-red-500",
						className,
					)}
					style={style}
				/>
			)}
			{type === "number" && (
				<div
					className={twMerge(
						"-right-2 -top-2 absolute flex items-center justify-center rounded-full bg-red-500 font-bold text-white text-xs",
						isOneText ? "h-[18px] w-[18px] leading-[18px]" : "px-1",
						className,
					)}
				>
					{text}
				</div>
			)}
		</div>
	);
};

export default Badge;
