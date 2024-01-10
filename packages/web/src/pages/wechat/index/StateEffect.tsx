import { isNumber } from 'lodash-es';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import btmNavbarsState from '@/state/btmNavbarsState';
import { dialogueListState } from '@/state/dialogueState';
import totalUnreadCountState, { CalcuateType } from '@/state/totalUnreadCountState';

const StateEffect = () => {
  const dialogueList = useRecoilValue(dialogueListState);
  const [totalUnreadCount, setTotalUnreadCount] = useRecoilState(totalUnreadCountState);
  const setBtmNavbars = useSetRecoilState(btmNavbarsState);

  useEffect(() => {
    if (totalUnreadCount.calcuateType === CalcuateType.AUTO) {
      const count = dialogueList.reduce((acc, dialogue) => {
        if (!dialogue.badgeHide && dialogue.unreadDisplayType !== 'dot' && isNumber(dialogue.unreadMarkNumber)) {
          return acc + dialogue.unreadMarkNumber;
        }
        return acc;
      }, 0);
      setTotalUnreadCount((v) => ({
        ...v,
        count,
      }));
    }
  }, [dialogueList]);

  useEffect(() => {
    setBtmNavbars((pv) => ({
      ...pv,
      WECHAT: {
        ...pv.WECHAT,
        badgeNumber: totalUnreadCount.count,
      },
    }));
  }, [totalUnreadCount]);

  return <></>;
};

export default StateEffect;
