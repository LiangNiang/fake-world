import { Form, Switch } from "antd";
import { useSetRecoilState } from "recoil";

import { statusBarHideState } from "@/state/statusBarState";

type FormValues = {
	hidden: boolean;
};

const StatusBarMetaDataEditor = ({ data }: EditorProps<boolean>) => {
	const [form] = Form.useForm<FormValues>();
	const setStatusBarHide = useSetRecoilState(statusBarHideState);

	const initialValues: FormValues = {
		hidden: data,
	};

	const onFinish = (values: FormValues) => {
		setStatusBarHide(values.hidden);
	};

	return (
		<Form
			form={form}
			layout="vertical"
			autoComplete="off"
			initialValues={initialValues}
			onFinish={onFinish}
			onValuesChange={() => {
				setTimeout(() => {
					form.submit();
				});
			}}
		>
			<Form.Item name="hidden" label="是否隐藏" valuePropName="checked">
				<Switch />
			</Form.Item>
		</Form>
	);
};

export default StatusBarMetaDataEditor;
