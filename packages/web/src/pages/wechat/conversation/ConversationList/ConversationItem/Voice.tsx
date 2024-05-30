import { memo } from "react";
import { twJoin } from "tailwind-merge";

import VoiceSVG from "@/assets/voice.svg?react";
import { EConversationRole, type IConversationTypeVoice } from "@/state/conversationState";
import type { IProfile } from "@/state/profile";

import CommonBlock from "./CommonBlock";

type Props = {
	duration: IConversationTypeVoice["duration"];
	senderId: IProfile["id"];
	upperText: IConversationTypeVoice["upperText"];
	isRead: IConversationTypeVoice["isRead"];
	role: IConversationTypeVoice["role"];
	showStt: IConversationTypeVoice["showStt"];
	stt: IConversationTypeVoice["stt"];
};

const Voice = ({ senderId, upperText, duration, role, isRead, showStt, stt }: Props) => {
	return (
		<>
			<CommonBlock
				senderId={senderId}
				upperText={upperText}
				innerBlockClassName="w-full group-[.friend]:bg-white group-[.mine]:bg-[#8CE97F] group-[.friend]:before:bg-white group-[.mine]:before:bg-[#8CE97F]"
				blockStyle={{
					width: `${duration <= 10 ? 30 + duration * 2.2 : 52}%`,
					maxWidth: "52%",
				}}
				extraElement={
					!isRead &&
					role === EConversationRole.friend && (
						<div className="-right-5 -translate-y-1/2 absolute top-1/2">
							<div className="h-2 w-2 rounded-full bg-wechatRed-3" />
						</div>
					)
				}
			>
				<div
					className={twJoin(
						"flex h-6",
						role === EConversationRole.mine ? "flex-row-reverse" : "flex-row",
					)}
				>
					<VoiceSVG
						width={28}
						height={28}
						className={twJoin("self-center", role === EConversationRole.mine && "rotate-180")}
					/>
					<span className="self-center text-sm">{duration}&apos;&apos;</span>
				</div>
			</CommonBlock>
			{showStt && !!stt && (
				<CommonBlock
					hideAvatar
					upperText={undefined}
					senderId={senderId}
					innerBlockClassName="bg-white"
					blockClassName="!mt-1"
				>
					{stt}
				</CommonBlock>
			)}
		</>
	);
};

export default memo(Voice);
