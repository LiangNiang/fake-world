import { Select } from 'antd';
import { values } from 'lodash-es';
import { useRecoilState } from 'recoil';

import { deviceState, MOBILE_LIST } from '@/state/screenState';

type Props = {
  onChange?: (v: MOBILE_LIST) => void;
};

const ScreenDevicesSelect = ({ onChange }: Props) => {
  const [device, setDevice] = useRecoilState(deviceState);

  const options = values(MOBILE_LIST).map((v) => ({
    label: v,
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
