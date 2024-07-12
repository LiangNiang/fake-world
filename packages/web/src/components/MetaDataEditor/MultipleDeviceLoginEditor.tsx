import {
	ALL_LOGIN_DEVICES,
	type TStateMultipleDeviceLogin,
	multipleDeviceLoginAtom,
} from "@/stateV2/multipleDeviceLogin";
import { Checkbox, Form, Switch } from "antd";
import { useSetAtom } from "jotai";

const MultipleDeviceLoginEditor = ({ data }: EditorProps<TStateMultipleDeviceLogin>) => {
	const [form] = Form.useForm<TStateMultipleDeviceLogin>();
	const setDevices = useSetAtom(multipleDeviceLoginAtom);

	const onFinish = (vaules: TStateMultipleDeviceLogin) => {
		setDevices(vaules);
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
			<Form.Item<TStateMultipleDeviceLogin> name="visible" label="是否显示" valuePropName="checked">
				<Switch />
			</Form.Item>
			<Form.Item<TStateMultipleDeviceLogin> name="devices" label="选择设备">
				<Checkbox.Group options={ALL_LOGIN_DEVICES.map((v) => ({ value: v, label: v }))} />
			</Form.Item>
		</Form>
	);
};

export default MultipleDeviceLoginEditor;
