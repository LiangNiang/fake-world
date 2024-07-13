import PayRewardOutlinedSVG from "@/assets/pay-reward-outlined.svg?react";
import { h } from "@/components/HashAssets";
import type { TTransactionType } from "@/stateV2/transaction";
import { isString } from "antd/es/button";
import type { ReactNode } from "react";
import CreditCardSVG from "./assets/credit-card.svg?react";
import RedPacketPNG from "./assets/red-packet.png";

export type TTopProps = {
	avatar?: ReactNode;
	to: ReactNode;
	amount: string;
	type: TTransactionType;
};

const Top = ({ avatar, to, amount, type }: TTopProps) => {
	const renderAvatar = () => {
		if (type === "pay-reward") {
			return (
				<div className="flex h-12 w-12 items-center justify-center rounded-full bg-wechatOrange-1">
					<PayRewardOutlinedSVG fill="white" height={36} width={36} />
				</div>
			);
		}
		if (type === "red-packet") {
			return (
				<div className="flex h-12 w-12 items-center justify-center rounded-full bg-wechatRed-1">
					<img src={RedPacketPNG} className="h-6 w-5" />
				</div>
			);
		}
		if (type === "credit-card-repayments") {
			return (
				<div className="flex h-12 w-12 items-center justify-center rounded-full bg-wechatBrand-1">
					<CreditCardSVG fill="white" className="h-6 w-6" />
				</div>
			);
		}
		if (isString(avatar)) {
			return <h.img src={avatar} className="h-12 w-12 rounded-full object-cover object-center" />;
		}
		return avatar;
	};

	const renderAmount = () => {
		if (type !== "credit-card-repayments") {
			return `-${amount}`;
		}
		return amount;
	};

	return (
		<>
			{renderAvatar()}
			<div className="mt-3 text-lg">{to}</div>
			<div className="mt-4 font-semibold text-3xl">{renderAmount()}</div>
		</>
	);
};

export default Top;
