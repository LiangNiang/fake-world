import Done2SVG from "@/assets/done2-outlined.svg?react";
import ErrorSVG from "@/assets/error-outlined.svg?react";
import Previous2SVG from "@/assets/previous2-outlined.svg?react";
import Transfer2SVG from "@/assets/transfer2-outlined.svg?react";
import type { IConversationTypeTransfer } from "@/stateV2/conversation";
import type { IStateProfile } from "@/stateV2/profile";
import { get, isEmpty } from "lodash-es";
import { type ComponentType, type SVGProps, memo } from "react";
import { twJoin } from "tailwind-merge";
import { TRANSFER_TEXT_NOTE_MAP } from "../consts";
import CommonBlock from "./CommonBlock";

type Props = {
	role: IConversationTypeTransfer["role"];
	upperText: IConversationTypeTransfer["upperText"];
	senderId: IStateProfile["id"];
	transferStatus: IConversationTypeTransfer["transferStatus"];
	amount: IConversationTypeTransfer["amount"];
	note: IConversationTypeTransfer["note"];
	originalSender: IConversationTypeTransfer["originalSender"];
};

const SVG_COMPONENT_MAP: Record<
	IConversationTypeTransfer["transferStatus"],
	ComponentType<SVGProps<SVGSVGElement>>
> = {
	awaiting: Transfer2SVG,
	accepted: Done2SVG,
	rejected: Previous2SVG,
	expired: ErrorSVG,
};

const Transfer = ({
	upperText,
	senderId,
	transferStatus,
	amount,
	note,
	originalSender,
	role,
}: Props) => {
	const SVGComp = SVG_COMPONENT_MAP[transferStatus];
	const getTransferNote = () => {
		if (transferStatus === "awaiting") {
			return isEmpty(note)
				? get(TRANSFER_TEXT_NOTE_MAP, [originalSender, role, "awaiting"], "")
				: note;
		}
		return get(TRANSFER_TEXT_NOTE_MAP, [originalSender, role, transferStatus], "");
	};

	return (
		<CommonBlock
			upperText={upperText}
			senderId={senderId}
			blockClassName="w-4/5"
			innerBlockClassName={twJoin(
				"w-full pb-1",
				transferStatus === "awaiting" && "bg-wechatOrange-3 before:bg-wechatOrange-3",
				(transferStatus === "accepted" || transferStatus === "rejected") &&
					"bg-wechatOrange-5 before:bg-wechatOrange-5",
				transferStatus === "expired" && "bg-wechatOrange-5 before:bg-wechatOrange-5 saturate-60",
			)}
		>
			<div className="flex flex-col pl-1 text-white">
				<div className="flex flex-1 items-center border-white/10 border-b pb-2">
					<SVGComp fill="white" width={40} height={40} className="-ml-1 flex-shrink-0" />
					<div className="ml-1 flex h-10 flex-col justify-between overflow-hidden">
						<div className="font-medium">
							¥<span className="ml-[1px]">{amount}</span>
						</div>
						<span className="line-clamp-1 font-light text-xs">{getTransferNote()}</span>
					</div>
				</div>
				<span className="pt-1 font-light text-xs">微信转账</span>
			</div>
		</CommonBlock>
	);
};

export default memo(Transfer);
