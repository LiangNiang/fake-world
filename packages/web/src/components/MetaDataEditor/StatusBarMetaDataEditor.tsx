import { type TStateStatusBarConfig, statusBarConfigAtom } from "@/stateV2/statusBar";
import { Form, Radio, Switch } from "antd";
import { useSetAtom } from "jotai";

const StatusBarMetaDataEditor = ({ data }: EditorProps<TStateStatusBarConfig>) => {
	const [form] = Form.useForm<TStateStatusBarConfig>();
	const setStatusBarConfig = useSetAtom(statusBarConfigAtom);

	const onFinish = (values: TStateStatusBarConfig) => {
		setStatusBarConfig((pv) => ({ ...pv, ...values }));
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
			<Form.Item name="hide" label="是否隐藏" valuePropName="checked">
				<Switch />
			</Form.Item>
			<Form.Item name="signalIconType" label="信号类型">
				<Radio.Group>
					<Radio value="single">单卡</Radio>
					<Radio value="double">双卡</Radio>
					<Radio value="none">无</Radio>
				</Radio.Group>
			</Form.Item>
			<Form.Item name="networkIconType" label="网络类型">
				<Radio.Group>
					<Radio value="wifi">Wi-Fi</Radio>
					<Radio value="5G">5G</Radio>
				</Radio.Group>
			</Form.Item>
			<Form.Item name="batteryIconType" label="电池状态">
				<Radio.Group>
					<Radio value="normal">默认</Radio>
					<Radio value="charging">充电中</Radio>
					<Radio value="low">低电量</Radio>
					<Radio value="saving">省电模式</Radio>
				</Radio.Group>
			</Form.Item>
		</Form>
	);
};

export default StatusBarMetaDataEditor;
