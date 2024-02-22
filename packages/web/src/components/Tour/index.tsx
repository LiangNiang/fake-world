import { useInViewport } from 'ahooks';
import { Tour as AntdTour } from 'antd';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { EMenus, menuState, ModeState, modeState } from '@/state/globalConfig';
import { touredState, tourTargetState } from '@/state/globalConfig/tourState';
import { sleep } from '@/utils';

const Tour = () => {
  const [toured, setToured] = useRecoilState(touredState);
  const { ref1, ref2 } = useRecoilValue(tourTargetState);
  const [current, setCurrent] = useState(0);
  const setMenu = useSetRecoilState(menuState);
  const setMode = useSetRecoilState(modeState);
  const { t } = useTranslation();
  const [inViewport] = useInViewport(document.getElementById('left-panel') as HTMLElement);

  if (!inViewport) return null;

  return (
    <AntdTour
      current={current}
      open={!toured}
      onClose={() => {
        setToured(true);
        setCurrent(0);
      }}
      onFinish={() => {
        setMenu(EMenus.Main);
        setMode(ModeState.PREVIEW);
        setCurrent(0);
      }}
      steps={[
        {
          title: '进入编辑模式',
          description: t('menu.tourTip1'),
          target: ref1,
          nextButtonProps: {
            onClick: async () => {
              setMode(ModeState.EDIT);
              setMenu(EMenus.Trees);
              await sleep(10);
              setCurrent(1);
            },
          },
        },
        {
          title: '点击第二个菜单，查看可编辑节点',
          description: (
            <>
              <p>{t('menu.tourTip2')}</p>
              <p>{t('menu.tourTip3')}</p>
            </>
          ),
          target: ref2,
          prevButtonProps: {
            onClick: async () => {
              setMode(ModeState.PREVIEW);
              await sleep(10);
              setCurrent(0);
            },
          },
        },
      ]}
    />
  );
};

export default memo(Tour);
