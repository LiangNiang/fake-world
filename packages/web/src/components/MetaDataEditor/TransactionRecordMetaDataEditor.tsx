import {
	randomCreditCardName,
	randomPaymentMethod,
	randomTransactionCode,
} from "@/faker/wechat/transaction";
import {
	BUILT_IN_TRANSACTION_TYPES,
	BUILT_IN_TRANSACTION_TYPES_LABELS,
	type TTransactionDataWithType,
	type TTransactionType,
	setUsedTransactionValue,
} from "@/stateV2/transaction";
import { Button, DatePicker, Form, Input, Radio } from "antd";
import dayjs from "dayjs";
import { isEmpty, omit } from "lodash-es";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import FriendSelect from "./FriendSelect";
import LocalImageUploadWithPreview from "./LocalImageUpload";

const TransactionRecordMetaDataEditor = ({
	data,
}: EditorProps<TTransactionDataWithType, TTransactionType>) => {
	const [form] = Form.useForm<TTransactionDataWithType>();
	const { getFieldValue, setFieldValue } = form;
	const navigate = useNavigate();
	const { t } = useTranslation();

	const onFinish = (v: TTransactionDataWithType) => {
		if (isEmpty(v)) return;
		setUsedTransactionValue(v.type, (pv) => ({
			...pv,
			...omit(v, ["type"]),
		}));
	};

	return (
		<Form
			form={form}
			layout="vertical"
			autoComplete="off"
			onFinish={onFinish}
			onValuesChange={() => {
				setTimeout(() => {
					form.submit();
				});
			}}
			initialValues={data}
		>
			<Form.Item name="type" label="类型" tooltip="切换类型将跳转到该交易类型页面">
				<Radio.Group
					onChange={(ev) => {
						const value = ev.target.value;
						navigate(`/wechat/transaction/${value}`, {
							replace: true,
						});
					}}
				>
					{BUILT_IN_TRANSACTION_TYPES.map((type) => (
						<Radio value={type} key={type}>
							{t(BUILT_IN_TRANSACTION_TYPES_LABELS[type])}
						</Radio>
					))}
				</Radio.Group>
			</Form.Item>
			<Form.Item<TTransactionDataWithType>
				name="amount"
				label="金额"
				required
				rules={[{ required: true }]}
			>
				<Input
					addonBefore="¥"
					suffix={
						<Button
							onClick={() => {
								const amount = getFieldValue("amount");
								const amountNumber = Number.parseFloat(amount);
								if (Number.isNaN(amountNumber)) return;
								setFieldValue("amount", amountNumber.toFixed(2));
								form.submit();
							}}
						>
							格式化金额
						</Button>
					}
				/>
			</Form.Item>
			<Form.Item<TTransactionDataWithType>
				name="code"
				label="交易单号"
				required
				rules={[{ required: true }]}
			>
				<Input
					suffix={
						<Button
							onClick={() => {
								const type = getFieldValue("type");
								setFieldValue("code", randomTransactionCode(type));
								form.submit();
							}}
						>
							随机生成
						</Button>
					}
				/>
			</Form.Item>
			<Form.Item<TTransactionDataWithType>
				name="payentMethod"
				label="交易方式"
				required
				rules={[{ required: true }]}
			>
				<Input
					suffix={
						<Button
							onClick={() => {
								const type = getFieldValue("type");
								const method = randomPaymentMethod(
									type === "credit-card-repayments"
										? { withCardType: false, withLast4CardNumber: false }
										: {},
								);
								setFieldValue("payentMethod", method);
								form.submit();
							}}
						>
							随机生成
						</Button>
					}
				/>
			</Form.Item>
			<Form.Item<TTransactionDataWithType>
				name="timestamp"
				label="交易时间"
				required
				rules={[{ required: true }]}
				getValueProps={(v) => {
					return {
						value: dayjs(v),
					};
				}}
				normalize={(v) => v.valueOf()}
			>
				<DatePicker showTime allowClear={false} />
			</Form.Item>
			<Form.Item noStyle shouldUpdate={(pv, cv) => pv.type !== cv.type}>
				{({ getFieldValue }) => {
					const type = getFieldValue("type");
					switch (type) {
						case "qr-transfer":
							return (
								<>
									<Form.Item<TTransactionDataWithType>
										name="toUsername"
										label="发给谁"
										required
										rules={[{ required: true }]}
									>
										<Input />
									</Form.Item>
									<Form.Item<TTransactionDataWithType>
										name="avatar"
										label="头像"
										required
										rules={[{ required: true }]}
									>
										<LocalImageUploadWithPreview />
									</Form.Item>
								</>
							);
						case "transfer":
							return (
								<>
									<Form.Item<TTransactionDataWithType>
										name="toFriendId"
										label="转账给谁"
										required
										rules={[{ required: true }]}
									>
										<FriendSelect withQuickAdd />
									</Form.Item>
									<Form.Item<TTransactionDataWithType>
										name="collectionTime"
										label="转账接受时间"
										required
										rules={[{ required: true }]}
										getValueProps={(v) => {
											return {
												value: dayjs(v),
											};
										}}
										normalize={(v) => v.valueOf()}
									>
										<DatePicker showTime allowClear={false} />
									</Form.Item>
								</>
							);
						case "red-packet":
							return (
								<>
									<Form.Item<TTransactionDataWithType>
										name="toFriendId"
										label="发红包给谁"
										required
										rules={[{ required: true }]}
									>
										<FriendSelect withQuickAdd />
									</Form.Item>
									<Form.Item<TTransactionDataWithType>
										name="merchantCode"
										label="商户单号"
										required
										rules={[{ required: true }]}
									>
										<Input
											suffix={
												<Button
													onClick={() => {
														setFieldValue(
															"merchantCode",
															randomTransactionCode("red-packet-merchant"),
														);
														form.submit();
													}}
												>
													随机生成
												</Button>
											}
										/>
									</Form.Item>
								</>
							);
						case "credit-card-repayments":
							return (
								<>
									<Form.Item<TTransactionDataWithType>
										name="toCreditCardName"
										label="还款的信用卡名"
										required
										rules={[{ required: true }]}
									>
										<Input
											suffix={
												<Button
													onClick={() => {
														setFieldValue("toCreditCardName", randomCreditCardName());
														form.submit();
													}}
												>
													随机生成
												</Button>
											}
										/>
									</Form.Item>
									<Form.Item<TTransactionDataWithType>
										name="merchantCode"
										label="商户单号"
										required
										rules={[{ required: true }]}
									>
										<Input
											suffix={
												<Button
													onClick={() => {
														setFieldValue(
															"merchantCode",
															randomTransactionCode("credit-card-repayments-merchant"),
														);
														form.submit();
													}}
												>
													随机生成
												</Button>
											}
										/>
									</Form.Item>
								</>
							);
						default:
							return null;
					}
				}}
			</Form.Item>
		</Form>
	);
};

export default TransactionRecordMetaDataEditor;
