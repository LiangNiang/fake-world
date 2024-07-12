import { MOBILE_LIST, MOBILE_LIST_LABEL, deviceAtom } from "@/stateV2/device";
import { Select } from "antd";
import { useAtom } from "jotai";
import { values } from "lodash-es";
import { useTranslation } from "react-i18next";

type Props = {
	onChange?: (v: MOBILE_LIST) => void;
};

const ScreenDevicesSelect = ({ onChange }: Props) => {
	const [device, setDevice] = useAtom(deviceAtom);
	const { t } = useTranslation();

	const options = values(MOBILE_LIST).map((v) => ({
		label: t(MOBILE_LIST_LABEL[v]),
		value: v,
	}));
	return (
		<Select
			options={options}
			value={device}
			onChange={(v) => {
				setDevice(v);
				onChange?.(v);
			}}
		/>
	);
};

export default ScreenDevicesSelect;
