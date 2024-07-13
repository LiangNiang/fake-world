import { h } from "@/components/HashAssets";
import { type IStateProfile, profileAtom } from "@/stateV2/profile";
import { useAtomValue } from "jotai";
import { type ComponentProps, memo } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
	id: IStateProfile["id"];
	size?: "default" | "small" | "large" | "middle";
	toProfile?: boolean;
}

const SIZE_MAP = {
	small: "h-9 w-9 rounded",
	default: "h-10 w-10 rounded",
	middle: "h-12 w-12 rounded",
	large: "h-16 w-16 rounded-md",
};

const UserAvatar = ({
	id,
	size = "default",
	className,
	...rest
}: Props & Omit<ComponentProps<typeof h.img>, "size">) => {
	const { avatarInfo } = useAtomValue(profileAtom(id))!;

	return (
		<h.img
			src={avatarInfo}
			className={twMerge(
				"object-cover object-center",
				SIZE_MAP[size as keyof typeof SIZE_MAP],
				className,
			)}
			{...rest}
		/>
	);
};

export default memo(UserAvatar);
