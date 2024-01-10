import dayjs from 'dayjs';

import {
  ITransactionCreditCardRepayments,
  ITransactionPayReward,
  ITransactionQrTransfer,
  ITransactionRedPacket,
  ITransactionTransfer,
} from '@/state/transaction';

import { randomAvatar } from '../user';
import { randomCreditCardName, randomPaymentMethod, randomTransactionCode } from '.';

export const BANK_LIST = [
  '招商银行',
  '中国银行',
  '工商银行',
  '建设银行',
  '农业银行',
  '交通银行',
  '邮储银行',
  '民生银行',
  '兴业银行',
  '平安银行',
  '中信银行',
  '浦发银行',
  '光大银行',
  '华夏银行',
  '广发银行',
  '北京银行',
  '上海银行',
  '宁波银行',
];

export const DEFAULT_QR_TRANSFER: ITransactionQrTransfer = {
  amount: '30.00',
  toUsername: '张三',
  avatar: randomAvatar(),
  timestamp: dayjs().valueOf(),
  code: randomTransactionCode('qr-transfer'),
  payentMethod: randomPaymentMethod(),
};

export const DEFAULT_TRANSFER: ITransactionTransfer = {
  toFriendId: '1',
  amount: '200.00',
  timestamp: dayjs().subtract(30, 'minute').valueOf(),
  collectionTime: dayjs().valueOf(),
  code: randomTransactionCode('transfer'),
  payentMethod: randomPaymentMethod(),
};

export const DEFAULT_PAY_REWARD: ITransactionPayReward = {
  amount: '50.00',
  timestamp: dayjs().valueOf(),
  code: randomTransactionCode('pay-reward'),
  payentMethod: randomPaymentMethod(),
};

export const DEFAULT_RED_PACKET: ITransactionRedPacket = {
  toFriendId: '2',
  amount: '100.00',
  timestamp: dayjs().valueOf(),
  code: randomTransactionCode('red-packet'),
  payentMethod: randomPaymentMethod(),
  merchantCode: randomTransactionCode('red-packet-merchant'),
};

export const DEFAULT_CREDIT_CARD_REPAYMENTS: ITransactionCreditCardRepayments = {
  toCreditCardName: randomCreditCardName(),
  amount: '2000.00',
  code: randomTransactionCode('credit-card-repayments'),
  timestamp: dayjs().valueOf(),
  payentMethod: randomPaymentMethod({ withCardType: false, withLast4CardNumber: false }),
  merchantCode: randomTransactionCode('credit-card-repayments-merchant'),
};
