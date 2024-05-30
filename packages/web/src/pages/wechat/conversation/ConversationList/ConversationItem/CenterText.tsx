import { memo } from "react";
import { twMerge } from "tailwind-merge";

import type { IConversationTypeSingleUpperText } from "@/state/conversationState";

type Props = {
	extraClassName: IConversationTypeSingleUpperText["extraClassName"];
	upperText: IConversationTypeSingleUpperText["upperText"];
	simpleContent: IConversationTypeSingleUpperText["simpleContent"];
};

const CenterText = ({ extraClassName, upperText, simpleContent }: Props) => {
	return (
		<>
			{upperText && <div className={"m-auto text-black/50 text-xs"}>{upperText}</div>}
			<div className={twMerge("m-auto text-black/50 text-xs", extraClassName)}>
				<div>{simpleContent}</div>
			</div>
		</>
	);
};

export default memo(CenterText);
