import { type TStateConversationInputterConfig, inputterConfigAtom } from "@/stateV2/conversation";
import { Form, Radio } from "antd";
import { useSetAtom } from "jotai";

const ConversationInputMetaDataEditor = ({
	data,
}: EditorProps<TStateConversationInputterConfig>) => {
	const [form] = Form.useForm<TStateConversationInputterConfig>();
	const setInputterConfig = useSetAtom(inputterConfigAtom);

	const onFinish = (values: TStateConversationInputterConfig) => {
		setInputterConfig(values);
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
				}, 100);
			}}
			initialValues={data}
		>
			<Form.Item<TStateConversationInputterConfig> name="sendRole" label="由谁发送">
				<Radio.Group>
					<Radio value="mine">我自己</Radio>
					<Radio value="friend">朋友</Radio>
				</Radio.Group>
			</Form.Item>
		</Form>
	);
};

export default ConversationInputMetaDataEditor;
