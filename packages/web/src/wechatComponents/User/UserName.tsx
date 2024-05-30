import { type ComponentPropsWithRef, memo } from "react";
import { useRecoilValue } from "recoil";
import { twMerge } from "tailwind-merge";

import { type IProfile, friendState } from "@/state/profile";

interface Props {
	id: IProfile["id"];
}

const UserName = ({ id, className, ...rest }: Props & ComponentPropsWithRef<"span">) => {
	const { remark, nickname } = useRecoilValue(friendState(id));

	return (
		<span className={twMerge("text-wechatLink-1", className)} {...rest}>
			{remark ?? nickname}
		</span>
	);
};

export default memo(UserName);
