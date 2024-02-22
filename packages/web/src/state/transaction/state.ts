import { atom } from 'recoil';

import {
  DEFAULT_CREDIT_CARD_REPAYMENTS,
  DEFAULT_PAY_REWARD,
  DEFAULT_QR_TRANSFER,
  DEFAULT_RED_PACKET,
  DEFAULT_TRANSFER,
} from '@/faker/wechat/transaction';

import { persistAtom } from '../effects';
import { ITransactionPayReward, ITransactionQrTransfer } from './typing';

/**
 * 交易类型
 * - `qr-transfer`: 二维码转账
 * - `transfer`: 转账（朋友转账）
 * - `pay-reward`: 赞赏码
 * - `red-packet`: 红包
 * - `credit-card-repayments`: 信用卡还款
 */
export const BUILT_IN_TRANSACTION_TYPES = ['qr-transfer', 'transfer', 'pay-reward', 'red-packet', 'credit-card-repayments'] as const;

export const BUILT_IN_TRANSACTION_TYPES_LABELS = {
  'qr-transfer': 'wechatPage.transactionType.qr',
  transfer: 'wechatPage.transactionType.transfer',
  'pay-reward': 'wechatPage.transactionType.payReward',
  'red-packet': 'wechatPage.transactionType.redPacket',
  'credit-card-repayments': 'wechatPage.transactionType.creditCard',
};

export const qrTransferState = atom<ITransactionQrTransfer>({
  key: 'qrTransferState',
  default: DEFAULT_QR_TRANSFER,
  effects_UNSTABLE: [persistAtom],
});

export const payRewardState = atom<ITransactionPayReward>({
  key: 'payRewardState',
  default: DEFAULT_PAY_REWARD,
  effects_UNSTABLE: [persistAtom],
});

export const transferState = atom({
  key: 'transferState',
  default: DEFAULT_TRANSFER,
  effects_UNSTABLE: [persistAtom],
});

export const redPacketStaet = atom({
  key: 'redPacketState',
  default: DEFAULT_RED_PACKET,
  effects_UNSTABLE: [persistAtom],
});

export const creditCardRepaymentsState = atom({
  key: 'creditCardRepaymentsState',
  default: DEFAULT_CREDIT_CARD_REPAYMENTS,
  effects_UNSTABLE: [persistAtom],
});

export const USED_STATE_MAP = {
  'qr-transfer': qrTransferState,
  'pay-reward': payRewardState,
  transfer: transferState,
  'red-packet': redPacketStaet,
  'credit-card-repayments': creditCardRepaymentsState,
};
