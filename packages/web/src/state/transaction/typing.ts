import { IProfile } from '../profile';
import { BUILT_IN_TRANSACTION_TYPES } from './state';

export type TTransactionType = (typeof BUILT_IN_TRANSACTION_TYPES)[number];

export interface ITransactionBase {
  amount: string;
  timestamp: number;
  code: string;
  payentMethod: string;
}

export interface ITransactionQrTransfer extends ITransactionBase {
  toUsername: string;
  avatar: string;
}

export interface ITransactionTransfer extends ITransactionBase {
  toFriendId: IProfile['id'];
  collectionTime: number;
}

export interface ITransactionPayReward extends ITransactionBase {}

export interface ITransactionRedPacket extends ITransactionBase {
  toFriendId: IProfile['id'];
  merchantCode: string;
}

export interface ITransactionCreditCardRepayments extends ITransactionBase {
  toCreditCardName: string;
  merchantCode: string;
}

export type TTransactionData =
  | ITransactionQrTransfer
  | ITransactionTransfer
  | ITransactionPayReward
  | ITransactionRedPacket
  | ITransactionCreditCardRepayments;

export type TTransactionDataWithType = TTransactionData & { type: TTransactionType };
