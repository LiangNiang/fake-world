import type { IStateProfile } from "../profile";
import type { BUILT_IN_TRANSACTION_TYPES } from "./consts";

export type TTransactionType = (typeof BUILT_IN_TRANSACTION_TYPES)[number];

export interface IStateTransactionBase {
	type: TTransactionType;
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
	toFriendId: IStateProfile["id"];
	collectionTime: number;
}

export interface IStateTransactionPayReward extends IStateTransactionBase {}

export interface IStateTransactionRedPacket extends IStateTransactionBase {
	toFriendId: IStateProfile["id"];
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
