import { omit } from "lodash-es";
import type { ComponentProps } from "react";
import { twJoin } from "tailwind-merge";

type Props = {
	active?: boolean;
};

const AnchorItem = ({ active, children, className, ...rest }: ComponentProps<"div"> & Props) => {
	return (
		<div className="cursor-pointer pr-2 pl-3" {...omit(rest, "key")}>
			<div
				className={twJoin(
					"flex h-4 w-4 items-center justify-center rounded-full",
					active && "bg-wechatBrand-1 text-white",
					className,
				)}
			>
				{children}
			</div>
		</div>
	);
};

export default AnchorItem;
