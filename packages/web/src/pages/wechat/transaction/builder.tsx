import type { InjectProps } from "@/components/NodeDetected";
import { EMetaDataType, type StaticMetaData } from "@/stateV2/detectedNode";
import {
	BUILT_IN_TRANSACTION_TYPES_LABELS,
	type IStateTransactionCreditCardRepayments,
	type IStateTransactionPayReward,
	type IStateTransactionQrTransfer,
	type IStateTransactionRedPacket,
	type IStateTransactionTransfer,
	type TTransactionType,
	USED_ATOM_MAP,
} from "@/stateV2/transaction";
import UserAvatar from "@/wechatComponents/User/UserAvatar";
import UserName from "@/wechatComponents/User/UserName";
import dayjs from "dayjs";
import { useAtomValue } from "jotai";
import Columns, { type TColumnContainerProps } from "./Column";
import DetaiLayout from "./DetaiLayout";
import Top, { type TTopProps } from "./Top";

const COMMON_TIME_FORMAT_STR = "YYYY年MM月DD日 HH:mm:ss";

function generateTopElementConfig(type: TTransactionType, data: unknown): TTopProps | null {
	switch (type) {
		case "qr-transfer": {
			const { avatar, toUsername, amount } = data as IStateTransactionQrTransfer;
			return {
				avatar,
				to: `扫二维码付款-给${toUsername}`,
				amount,
				type,
			};
		}
		case "pay-reward": {
			const { amount } = data as IStateTransactionPayReward;
			return {
				to: "赞赏码",
				amount,
				type,
			};
		}
		case "transfer": {
			const { toFriendId, amount } = data as IStateTransactionTransfer;
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
			const { toFriendId, amount } = data as IStateTransactionRedPacket;
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
			const { toCreditCardName, amount } = data as IStateTransactionCreditCardRepayments;
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
			const { payentMethod, timestamp, code } = data as IStateTransactionQrTransfer;
			const timeStr = dayjs(timestamp).format(COMMON_TIME_FORMAT_STR);
			return {
				keys: ["当前状态", "收款方备注", "支付方式", "转账时间", "转账单号"],
				data: ["支付成功", "二维码收款", payentMethod, timeStr, code],
			};
		}
		case "pay-reward": {
			const { timestamp, payentMethod, code } = data as IStateTransactionPayReward;
			const timeStr = dayjs(timestamp).format(COMMON_TIME_FORMAT_STR);
			return {
				keys: ["当前状态", "收款方备注", "支付时间", "支付方式", "转账单号"],
				data: ["朋友已收钱", "赞赏码", timeStr, payentMethod, code],
			};
		}
		case "transfer": {
			const { timestamp, payentMethod, code, collectionTime } = data as IStateTransactionTransfer;
			const timeStr = dayjs(timestamp).format(COMMON_TIME_FORMAT_STR);
			const collectionTimeStr = dayjs(collectionTime).format(COMMON_TIME_FORMAT_STR);
			return {
				keys: ["当前状态", "转账说明", "转账时间", "收款时间", "支付方式", "转账单号"],
				data: ["对方已收钱", "微信转账", timeStr, collectionTimeStr, payentMethod, code],
			};
		}
		case "red-packet": {
			const { timestamp, payentMethod, code, merchantCode } = data as IStateTransactionRedPacket;
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
				data as IStateTransactionCreditCardRepayments;
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
		type: EMetaDataType.TransactionRecord,
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
			const { toFriendId } = data as IStateTransactionTransfer;
			return [
				{
					...base,
					label: "交易详情",
				},
				{
					type: EMetaDataType.FirendProfile,
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
	if (!Object.prototype.hasOwnProperty.call(USED_ATOM_MAP, type)) return <></>;

	const stateFunc = USED_ATOM_MAP[type];
	const data = useAtomValue(stateFunc);

	const topConfig = generateTopElementConfig(type, data);
	const columnConfig = generateColumnConfig(type, data);
	const metaData = generateMetaData(type, data);

	const TopElement = topConfig ? <Top {...topConfig} /> : null;
	const ColumnElement = columnConfig ? <Columns {...columnConfig} /> : null;

	return <DetaiLayout topElement={TopElement} columnElement={ColumnElement} metaData={metaData} />;
}
