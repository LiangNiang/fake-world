import { useRecoilValue } from 'recoil';
import { twJoin } from 'tailwind-merge';

import PadOutlined from '@/assets/pad-outlined.svg?react';
import { canBeDetected } from '@/components/NodeDetected';
import { MetaDataType } from '@/state/detectedNode';
import { multipleDeviceLoginState } from '@/state/multipleDeviceLoginState';

const MultipleDeviceLogin = () => {
  const { visible } = useRecoilValue(multipleDeviceLoginState);

  return (
    <canBeDetected.div
      className={twJoin('flex items-center border-b border-black/5 bg-[rgba(237,237,237,1)] px-7 pb-2 pt-3 text-sm', visible ? 'visible' : 'hidden')}
      metaData={{
        type: MetaDataType.MultipleDeviceLogin,
        treeItemDisplayName: (d) => `多设备登录显示，目前${d.devices.length}个设备`,
      }}
    >
      <PadOutlined fill="rgba(0, 0, 0, 0.7)" width={20} height={20} />
      <span className="ml-5 text-black/60">iPad 微信已登录</span>
    </canBeDetected.div>
  );
};

export default MultipleDeviceLogin;
