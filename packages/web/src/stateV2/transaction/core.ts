import {
	DEFAULT_CREDIT_CARD_REPAYMENTS,
	DEFAULT_PAY_REWARD,
	DEFAULT_QR_TRANSFER,
	DEFAULT_RED_PACKET,
	DEFAULT_TRANSFER,
} from "@/faker/wechat/transaction";
import type { SetStateAction } from "jotai";
import atomWithStorage from "../atomWithStorage";
import { mainStore } from "../store";
import type {
	IStateTransactionCreditCardRepayments,
	IStateTransactionPayReward,
	IStateTransactionQrTransfer,
	IStateTransactionRedPacket,
	IStateTransactionTransfer,
	TTransactionData,
} from "./typing";

export const qrTransferAtom = atomWithStorage<IStateTransactionQrTransfer>(
	"qrTransfer",
	DEFAULT_QR_TRANSFER,
);

export const payRewardAtom = atomWithStorage<IStateTransactionPayReward>(
	"payReward",
	DEFAULT_PAY_REWARD,
);

export const transferAtom = atomWithStorage<IStateTransactionTransfer>(
	"transfer",
	DEFAULT_TRANSFER,
);

export const redPacketAtom = atomWithStorage<IStateTransactionRedPacket>(
	"redPacket",
	DEFAULT_RED_PACKET,
);

export const creditCardRepaymentsAtom = atomWithStorage<IStateTransactionCreditCardRepayments>(
	"creditCardRepayments",
	DEFAULT_CREDIT_CARD_REPAYMENTS,
);

export const USED_ATOM_MAP = {
	"qr-transfer": qrTransferAtom,
	"pay-reward": payRewardAtom,
	transfer: transferAtom,
	"red-packet": redPacketAtom,
	"credit-card-repayments": creditCardRepaymentsAtom,
};

export const getUsedTransactionValueSnapshot = (type: keyof typeof USED_ATOM_MAP) =>
	mainStore.get(USED_ATOM_MAP[type]);
export const setUsedTransactionValue = (
	type: keyof typeof USED_ATOM_MAP,
	args: SetStateAction<TTransactionData>,
	// @ts-ignore
) => mainStore.set(USED_ATOM_MAP[type], args);
