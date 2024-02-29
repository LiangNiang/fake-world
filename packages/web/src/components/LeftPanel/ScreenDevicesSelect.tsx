import { Select } from 'antd';
import { values } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';

import { deviceState, MOBILE_LIST, MOBILE_LIST_LABEL } from '@/state/screenState';

type Props = {
  onChange?: (v: MOBILE_LIST) => void;
};

const ScreenDevicesSelect = ({ onChange }: Props) => {
  const [device, setDevice] = useRecoilState(deviceState);
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
