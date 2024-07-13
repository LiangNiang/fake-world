import type { IProfile } from "@/state/profile";
import type { BUILT_IN_TRANSACTION_TYPES } from "./consts";

export type TTransactionType = (typeof BUILT_IN_TRANSACTION_TYPES)[number];

export interface IStateTransactionBase {
	amount: string;
	timestamp: number;
	code: string;
	payentMethod: string;
}

export interface IStateTransactionQrTransfer extends IStateTransactionBase {
	toUsername: string;
	avatar: string;
}

export interface IStateTransactionTransfer extends IStateTransactionBase {
	toFriendId: IProfile["id"];
	collectionTime: number;
}

export interface IStateTransactionPayReward extends IStateTransactionBase {}

export interface IStateTransactionRedPacket extends IStateTransactionBase {
	toFriendId: IProfile["id"];
	merchantCode: string;
}

export interface IStateTransactionCreditCardRepayments extends IStateTransactionBase {
	toCreditCardName: string;
	merchantCode: string;
}

export type TTransactionData =
	| IStateTransactionQrTransfer
	| IStateTransactionTransfer
	| IStateTransactionPayReward
	| IStateTransactionRedPacket
	| IStateTransactionCreditCardRepayments;

export type TTransactionDataWithType = TTransactionData & { type: TTransactionType };
