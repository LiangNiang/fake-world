/**
 * 交易类型
 * - `qr-transfer`: 二维码转账
 * - `transfer`: 转账（朋友转账）
 * - `pay-reward`: 赞赏码
 * - `red-packet`: 红包
 * - `credit-card-repayments`: 信用卡还款
 */
export const BUILT_IN_TRANSACTION_TYPES = [
	"qr-transfer",
	"transfer",
	"pay-reward",
	"red-packet",
	"credit-card-repayments",
] as const;

export const BUILT_IN_TRANSACTION_TYPES_LABELS = {
	"qr-transfer": "wechatPage.transactionType.qr",
	transfer: "wechatPage.transactionType.transfer",
	"pay-reward": "wechatPage.transactionType.payReward",
	"red-packet": "wechatPage.transactionType.redPacket",
	"credit-card-repayments": "wechatPage.transactionType.creditCard",
};
