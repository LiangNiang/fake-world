import { InfoCircleOutlined } from '@ant-design/icons';
import { useKeyPress } from 'ahooks';
import { Radio, Space, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSetRecoilState } from 'recoil';

import { ALL_LANGUAGES } from '@/i18n';
import { activatedNodeState, hoverdNodeState } from '@/state/detectedNode';
import { ModeState } from '@/state/globalConfig';
import { tourTargetState } from '@/state/globalConfig/tourState';
import { LOCALE_MAP } from '@/time';

import ModeSwitch from '../ModeSwitch';
import useMode from '../useMode';
import QuickJumpSelect from './QuickJumpSelect';

const CommonBlock = () => {
  const { setMode, isPreview } = useMode();
  const setHoverdNode = useSetRecoilState(hoverdNodeState);
  const setActivatedNode = useSetRecoilState(activatedNodeState);
  const { i18n, t } = useTranslation();
  const setTourTarget = useSetRecoilState(tourTargetState);

  useEffect(() => {
    if (isPreview) {
      setActivatedNode(null);
      setHoverdNode(null);
    }
  }, [isPreview]);

  useKeyPress(
    'shift.z',
    () => {
      setMode((prev) => (prev === ModeState.EDIT ? ModeState.PREVIEW : ModeState.EDIT));
    },
    { exactMatch: true }
  );

  return (
    <div className="mb-2 space-y-2 border-b pb-2">
      <div className="grid grid-cols-2 gap-1">
        <div className="col-span-1">
          <Tooltip title={t('base.quickJumpTooltip')}>
            {t('base.quickJump')} <InfoCircleOutlined className="cursor-pointer" />
          </Tooltip>
        </div>
        <QuickJumpSelect />
      </div>
      <div
        className="grid grid-cols-2 gap-1"
        ref={(element) => {
          setTourTarget((pv) => ({
            ...pv,
            ref1: element,
          }));
        }}
      >
        <div className="col-span-1">
          <Tooltip title={t('base.modeTooltip')}>
            {t('base.mode')} <InfoCircleOutlined className="cursor-pointer" />
          </Tooltip>
        </div>
        <div className="col-span-1">
          <ModeSwitch />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1">
        <div className="col-span-1">
          <Tooltip title={t('base.langTooltip')}>
            {t('base.lang')} <InfoCircleOutlined className="cursor-pointer" />
          </Tooltip>
        </div>
        <div className="col-span-1">
          <Radio.Group
            value={i18n.language}
            onChange={(ev) => {
              i18n.changeLanguage(ev.target.value);
              dayjs.locale(LOCALE_MAP[ev.target.value as keyof typeof LOCALE_MAP]);
            }}
          >
            <Space direction="vertical">
              {ALL_LANGUAGES.map((v) => (
                <Radio key={v.value} value={v.value}>
                  {v.label}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </div>
      </div>
    </div>
  );
};

export default CommonBlock;
