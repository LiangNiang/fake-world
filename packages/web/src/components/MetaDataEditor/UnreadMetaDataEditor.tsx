import { dialogueListState } from "@/state/dialogueState";
import { type TStateUnreadCount, unreadCountAtom } from "@/stateV2/unreadCount";
import { Form, InputNumber, Radio } from "antd";
import { useSetAtom } from "jotai";
import { isNumber } from "lodash-es";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";

const UnreadMetaDataEditor = ({ data }: EditorProps<TStateUnreadCount>) => {
	const [form] = Form.useForm<TStateUnreadCount>();
	const dialogueList = useRecoilValue(dialogueListState);
	const setUnreadCount = useSetAtom(unreadCountAtom);
	const calcuateTypeValue = Form.useWatch("calcuateType", form);

	useEffect(() => {
		if (calcuateTypeValue === "auto") {
			const count = dialogueList.reduce((acc, dialogue) => {
				if (
					!dialogue.badgeHide &&
					dialogue.unreadDisplayType !== "dot" &&
					isNumber(dialogue.unreadMarkNumber)
				) {
					return acc + dialogue.unreadMarkNumber;
				}
				return acc;
			}, 0);
			form.setFieldValue("count", count);
		}
	}, [calcuateTypeValue]);

	const onFinish = (v: TStateUnreadCount) => {
		setUnreadCount(v);
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
			<Form.Item<TStateUnreadCount> name="calcuateType" label="通知数量计算方式">
				<Radio.Group>
					<Radio value="auto">自动</Radio>
					<Radio value="static">静态值</Radio>
				</Radio.Group>
			</Form.Item>
			<Form.Item<TStateUnreadCount> name="count" label="通知数量">
				<InputNumber disabled={calcuateTypeValue === "auto"} min={0} />
			</Form.Item>
		</Form>
	);
};

export default UnreadMetaDataEditor;
