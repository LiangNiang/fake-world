import { Button, Form, Input } from "antd";
import { useSetRecoilState } from "recoil";

import { type IWallet, walletState } from "@/state/walletState";

const WalletMetaDataEditor = ({ data }: EditorProps<IWallet>) => {
	const setWallet = useSetRecoilState(walletState);
	const [form] = Form.useForm<IWallet>();

	const onFinish = (values: IWallet) => {
		setWallet((prev) => ({
			...prev,
			...values,
		}));
	};

	return (
		<Form
			form={form}
			layout="vertical"
			autoComplete="off"
			initialValues={data}
			onFinish={onFinish}
			onValuesChange={() => {
				setTimeout(() => {
					form.submit();
				});
			}}
		>
			<Form.Item<IWallet> name="balance" label="零钱余额">
				<Input
					addonBefore="¥"
					suffix={
						<Button
							onClick={() => {
								const balance = form.getFieldValue("balance");
								const balanceNumber = Number.parseFloat(balance);
								if (Number.isNaN(balanceNumber)) return;
								form.setFieldValue("balance", balanceNumber.toFixed(2));
								form.submit();
							}}
						>
							格式化金额
						</Button>
					}
				/>
			</Form.Item>
			<Form.Item<IWallet> name="miniFund" label="零钱通余额">
				<Input
					addonBefore="¥"
					suffix={
						<Button
							onClick={() => {
								const miniFund = form.getFieldValue("miniFund");
								const miniFundNumber = Number.parseFloat(miniFund);
								if (Number.isNaN(miniFundNumber)) return;
								form.setFieldValue("miniFund", miniFundNumber.toFixed(2));
								form.submit();
							}}
						>
							格式化金额
						</Button>
					}
				/>
			</Form.Item>
			<Form.Item<IWallet> name="miniFundYield" label="零钱通收益率">
				<Input addonAfter="%" />
			</Form.Item>
		</Form>
	);
};

export default WalletMetaDataEditor;
