import { Select } from 'antd';
import { get } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import useAppInfo from '../useAppInfo';

const QuickJumpSelect = () => {
  const [value, setValue] = useState<string | null>(null);
  const { app } = useAppInfo();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const SELECT_OPTIONS = {
    '/wechat': [
      {
        label: t('quickJump.wechat.index'),
        value: '/wechat',
      },
      {
        label: t('quickJump.wechat.profileEdit'),
        value: '/wechat/my/profile-edit',
      },
      {
        label: t('quickJump.wechat.services'),
        value: '/wechat/service',
      },
      {
        label: t('quickJump.wechat.balance'),
        value: '/wechat/wallet/balance',
      },
      {
        label: t('quickJump.wechat.moments'),
        value: '/wechat/moments',
      },
      {
        label: t('quickJump.wechat.trans'),
        value: '/wechat/transaction/qr-transfer',
      },
    ],
  };

  const options = get(SELECT_OPTIONS, app?.id ?? '', []) as { label: string; value: string }[];

  useEffect(() => {
    const match = options.find((v) => v.value === (location.pathname === '/' ? '/wechat' : location.pathname));
    if (match) {
      setValue(match.value);
    } else {
      setValue(null);
    }
  }, [location]);

  return (
    <Select
      options={options}
      value={value}
      onChange={(v) => {
        navigate(v);
      }}
      placeholder="通过下拉选项快速跳转到子页面"
    />
  );
};

export default QuickJumpSelect;
