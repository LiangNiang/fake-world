import { type IStateProfile, profileAtom } from "@/stateV2/profile";
import { useAtomValue } from "jotai";
import { type ComponentPropsWithRef, memo } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
	id: IStateProfile["id"];
}

const UserName = ({ id, className, ...rest }: Props & ComponentPropsWithRef<"span">) => {
	const { remark, nickname } = useAtomValue(profileAtom(id))!;

	return (
		<span className={twMerge("text-wechatLink-1", className)} {...rest}>
			{remark ?? nickname}
		</span>
	);
};

export default memo(UserName);
