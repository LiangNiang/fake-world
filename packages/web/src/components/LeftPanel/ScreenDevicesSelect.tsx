import { Select } from 'antd';
import { values } from 'lodash-es';
import { useRecoilState } from 'recoil';

import { deviceState, MOBILE_LIST } from '@/state/screenState';

const ScreenDevicesSelect = () => {
  const [device, setDevice] = useRecoilState(deviceState);

  const options = values(MOBILE_LIST).map((v) => ({
    label: v,
    value: v,
  }));
  return <Select options={options} value={device} onChange={(v) => setDevice(v)} />;
};

export default ScreenDevicesSelect;
