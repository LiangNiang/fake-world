import dayjs from "dayjs";
import { useRecoilValue } from "recoil";

import type { InjectProps } from "@/components/NodeDetected";
import { MetaDataType } from "@/state/detectedNode";
import type { StaticMetaData } from "@/state/detectedNode/typing";
import {
	BUILT_IN_TRANSACTION_TYPES_LABELS,
	type ITransactionCreditCardRepayments,
	type ITransactionPayReward,
	type ITransactionQrTransfer,
	type ITransactionRedPacket,
	type ITransactionTransfer,
	type TTransactionType,
	USED_STATE_MAP,
} from "@/state/transaction";
import UserAvatar from "@/wechatComponents/User/UserAvatar";
import UserName from "@/wechatComponents/User/UserName";

import Columns, { type TColumnContainerProps } from "./Column";
import DetaiLayout from "./DetaiLayout";
import Top, { type TTopProps } from "./Top";

const COMMON_TIME_FORMAT_STR = "YYYY年MM月DD日 HH:mm:ss";

function generateTopElementConfig(type: TTransactionType, data: unknown): TTopProps | null {
	switch (type) {
		case "qr-transfer": {
			const { avatar, toUsername, amount } = data as ITransactionQrTransfer;
			return {
				avatar,
				to: `扫二维码付款-给${toUsername}`,
				amount,
				type,
			};
		}
		case "pay-reward": {
			const { amount } = data as ITransactionPayReward;
			return {
				to: "赞赏码",
				amount,
				type,
			};
		}
		case "transfer": {
			const { toFriendId, amount } = data as ITransactionTransfer;
			return {
				avatar: <UserAvatar id={toFriendId} size="middle" className="rounded-full" />,
				to: (
					<div>
						转账-转给
						<UserName id={toFriendId} className="text-black" />
					</div>
				),
				amount,
				type,
			};
		}
		case "red-packet": {
			const { toFriendId, amount } = data as ITransactionRedPacket;
			return {
				to: (
					<div>
						微信红包-发给
						<UserName id={toFriendId} className="text-black" />
					</div>
				),
				amount,
				type,
			};
		}
		case "credit-card-repayments": {
			const { toCreditCardName, amount } = data as ITransactionCreditCardRepayments;
			return {
				to: `信用卡还款-${toCreditCardName}还款`,
				amount,
				type,
			};
		}
		default:
			return null;
	}
}

function generateColumnConfig(type: TTransactionType, data: unknown): TColumnContainerProps | null {
	switch (type) {
		case "qr-transfer": {
			const { payentMethod, timestamp, code } = data as ITransactionQrTransfer;
			const timeStr = dayjs(timestamp).format(COMMON_TIME_FORMAT_STR);
			return {
				keys: ["当前状态", "收款方备注", "支付方式", "转账时间", "转账单号"],
				data: ["支付成功", "二维码收款", payentMethod, timeStr, code],
			};
		}
		case "pay-reward": {
			const { timestamp, payentMethod, code } = data as ITransactionPayReward;
			const timeStr = dayjs(timestamp).format(COMMON_TIME_FORMAT_STR);
			return {
				keys: ["当前状态", "收款方备注", "支付时间", "支付方式", "转账单号"],
				data: ["朋友已收钱", "赞赏码", timeStr, payentMethod, code],
			};
		}
		case "transfer": {
			const { timestamp, payentMethod, code, collectionTime } = data as ITransactionTransfer;
			const timeStr = dayjs(timestamp).format(COMMON_TIME_FORMAT_STR);
			const collectionTimeStr = dayjs(collectionTime).format(COMMON_TIME_FORMAT_STR);
			return {
				keys: ["当前状态", "转账说明", "转账时间", "收款时间", "支付方式", "转账单号"],
				data: ["对方已收钱", "微信转账", timeStr, collectionTimeStr, payentMethod, code],
			};
		}
		case "red-packet": {
			const { timestamp, payentMethod, code, merchantCode } = data as ITransactionRedPacket;
			const timeStr = dayjs(timestamp).format(COMMON_TIME_FORMAT_STR);
			return {
				keys: ["当前状态", "红包详情", "支付时间", "支付方式", "交易单号", "商户单号"],
				data: [
					"支付成功",
					<span key="view" className="text-wechatLink-2">
						查看
					</span>,
					timeStr,
					payentMethod,
					code,
					merchantCode,
				],
			};
		}
		case "credit-card-repayments": {
			const { timestamp, payentMethod, code, merchantCode } =
				data as ITransactionCreditCardRepayments;
			const timeStr = dayjs(timestamp).format(COMMON_TIME_FORMAT_STR);
			return {
				keys: ["当前状态", "支付时间", "支付方式", "交易单号", "商户单号"],
				data: ["支付成功", timeStr, payentMethod, code, merchantCode],
			};
		}
		default:
			return null;
	}
}

function generateMetaData(type: TTransactionType, data: unknown): InjectProps["metaData"] | null {
	const base: StaticMetaData.InjectMetaData = {
		type: MetaDataType.TransactionRecord,
		index: type,
		treeItemDisplayName: (data, t) => t(BUILT_IN_TRANSACTION_TYPES_LABELS[data.type]),
	};
	switch (type) {
		case "qr-transfer":
		case "pay-reward":
		case "credit-card-repayments":
			return base;
		case "red-packet":
		case "transfer": {
			const { toFriendId } = data as ITransactionTransfer;
			return [
				{
					...base,
					label: "交易详情",
				},
				{
					type: MetaDataType.FirendProfile,
					index: toFriendId,
					label: "好友信息",
				},
			];
		}
		default:
			return null;
	}
}

export function buildDetailComponent(type: TTransactionType) {
	if (!Object.prototype.hasOwnProperty.call(USED_STATE_MAP, type)) return <></>;

	const stateFunc = USED_STATE_MAP[type];
	const data = useRecoilValue(stateFunc);

	const topConfig = generateTopElementConfig(type, data);
	const columnConfig = generateColumnConfig(type, data);
	const metaData = generateMetaData(type, data);

	const TopElement = topConfig ? <Top {...topConfig} /> : null;
	const ColumnElement = columnConfig ? <Columns {...columnConfig} /> : null;

	return <DetaiLayout topElement={TopElement} columnElement={ColumnElement} metaData={metaData} />;
}
