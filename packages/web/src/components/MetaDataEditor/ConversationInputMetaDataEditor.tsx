import { Form, Radio } from "antd";
import { useSetRecoilState } from "recoil";

import { conversationInputState } from "@/state/conversationState";
import { EConversationRole, type IConversationInputConfig } from "@/state/conversationState";

const ConversationInputMetaDataEditor = ({ data }: EditorProps<IConversationInputConfig>) => {
	const [form] = Form.useForm<IConversationInputConfig>();
	const setConversationInput = useSetRecoilState(conversationInputState);

	const onFinish = (values: IConversationInputConfig) => {
		setConversationInput(values);
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
			<Form.Item<IConversationInputConfig> name="sendRole" label="由谁发送">
				<Radio.Group>
					<Radio value={EConversationRole.mine}>我自己</Radio>
					<Radio value={EConversationRole.friend}>朋友</Radio>
				</Radio.Group>
			</Form.Item>
		</Form>
	);
};

export default ConversationInputMetaDataEditor;
