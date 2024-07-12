import {
	EBottomNavBars,
	type IBottomNavbarsItemConfig,
	bottomNavbarsAtom,
} from "@/stateV2/bottomNavbars";
import { Form, InputNumber, Radio, Switch } from "antd";
import { useSetAtom } from "jotai";
import { useMemo } from "react";
import { specialValueFormatter } from "./utils";

const NavigationBarMetaDataEditor = ({
	data,
	index,
}: EditorProps<IBottomNavbarsItemConfig, EBottomNavBars>) => {
	const setBottomNavbars = useSetAtom(bottomNavbarsAtom);
	const [form] = Form.useForm();

	const initialValues = useMemo(() => {
		const { badgeNumber, badgeType, activated, badgeHide } = data;
		return {
			badgeHide: specialValueFormatter(badgeHide, false),
			badgeNumber: specialValueFormatter(badgeNumber, undefined),
			badgeType: specialValueFormatter(badgeType, "number"),
			activated: specialValueFormatter(activated, false),
		};
	}, []);

	const onFinish = (values: IBottomNavbarsItemConfig) => {
		setBottomNavbars((prev) => {
			return {
				...prev,
				[index]: values,
			};
		});
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
			initialValues={initialValues}
		>
			<Form.Item<IBottomNavbarsItemConfig>
				name="activated"
				label="是否激活状态"
				valuePropName="checked"
			>
				<Switch />
			</Form.Item>
			<Form.Item<IBottomNavbarsItemConfig>
				name="badgeHide"
				label="是否隐藏角标"
				valuePropName="checked"
			>
				<Switch />
			</Form.Item>
			<Form.Item<IBottomNavbarsItemConfig>
				name="badgeNumber"
				label="角标数"
				tooltip={
					index === EBottomNavBars.WECHAT
						? "微信菜单上方的角标数量无法直接编辑，可以点击标题栏进行修改"
						: undefined
				}
			>
				<InputNumber disabled={index === EBottomNavBars.WECHAT} min={1} />
			</Form.Item>
			<Form.Item<IBottomNavbarsItemConfig> name="badgeType" label="角标类型">
				<Radio.Group>
					<Radio value="number">数字</Radio>
					<Radio value="dot">红点</Radio>
				</Radio.Group>
			</Form.Item>
		</Form>
	);
};

export default NavigationBarMetaDataEditor;
