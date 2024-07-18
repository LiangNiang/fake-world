import { statusBarHideAtom } from "@/stateV2/statusBar";
import { Form, Switch } from "antd";
import { useSetAtom } from "jotai";

type FormValues = {
	hidden: boolean;
};

const StatusBarMetaDataEditor = ({ data }: EditorProps<boolean>) => {
	const [form] = Form.useForm<FormValues>();
	const setStatusBarHide = useSetAtom(statusBarHideAtom);

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
