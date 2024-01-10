import { usePrevious } from 'ahooks';
import { values } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import { getRecoil, setRecoil } from 'recoil-nexus';
import { twJoin } from 'tailwind-merge';

import AlbumFilledSVG from '@/assets/album-filled.svg?react';
import LikeFilledSVG from '@/assets/like-filled.svg?react';
import LikeOutlinedSVG from '@/assets/like-outlined.svg?react';
import { MYSELF_ID } from '@/faker/wechat/user';
import { activatedNodeState, allNodesState } from '@/state/detectedNode';
import { ModeState, modeState } from '@/state/globalConfig';
import { friendState } from '@/state/profile';

import { useProfile } from './hook';

const CoverOperations = () => {
  const { id, momentsBackgroundLike } = useProfile();
  const previousMomentsBackgroundLike = usePrevious(momentsBackgroundLike);
  const { t } = useTranslation();

  const isMySelf = id === MYSELF_ID;

  const handleChangeCover = () => {
    setRecoil(modeState, ModeState.EDIT);
    const nodes = getRecoil(allNodesState);
    setRecoil(activatedNodeState, values(nodes)[0].id);
  };

  const handleChangeLike = () => {
    if (getRecoil(modeState) === ModeState.EDIT) return;
    setRecoil(friendState(id), (prev) => ({
      ...prev,
      momentsBackgroundLike: !prev.momentsBackgroundLike,
    }));
  };

  return (
    <div
      className={twJoin(
        'absolute -top-12 right-4 flex origin-center scale-90 cursor-pointer items-center',
        isMySelf ? 'flex-col space-y-1' : 'flex-row space-x-[2px] rounded-xl border border-white px-1 py-[1px]'
      )}
      onClick={isMySelf ? handleChangeCover : handleChangeLike}
    >
      {isMySelf ? (
        <>
          <AlbumFilledSVG fill="white" />
          <span className="text-xs text-white">{t('wechatPage.moments.changeCover')}</span>
        </>
      ) : (
        <>
          {momentsBackgroundLike ? (
            <LikeFilledSVG fill="#E14949" className={twJoin('h-5 w-5', previousMomentsBackgroundLike === false && 'animate-jump animate-once')} />
          ) : (
            <LikeOutlinedSVG fill="white" className="h-5 w-5" />
          )}
          <span className="text-sm text-white">{t('wechatPage.moments.like')}</span>
        </>
      )}
    </div>
  );
};

export default CoverOperations;
