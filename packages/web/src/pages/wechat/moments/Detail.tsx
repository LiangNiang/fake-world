import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { setRecoil } from 'recoil-nexus';

import BackFilledSVG from '@/assets/back-filled.svg?react';
import MoreFilledSVG from '@/assets/more-filled.svg?react';
import StickerOutlinedSVG from '@/assets/sticker-outlined.svg?react';
import useModeNavigate from '@/components/useModeNavigate';
import { generateInitFeedComment } from '@/faker/wechat/moments';
import { ModeState, modeState } from '@/state/globalConfig';
import { feedState } from '@/state/moments';

import Feed from './Feed';

const feedClassNames = {
  container: 'border-none p-3 flex-1 overflow-auto',
  avatar: 'h-10 w-10',
};

const MomentDetail = () => {
  const { id: feedId } = useParams();
  const { userId } = useRecoilValue(feedState(feedId ?? ''));
  const navigate = useModeNavigate();

  return (
    <>
      <div className="grid grid-cols-3 bg-[rgba(237,237,237,1)] px-4 py-2">
        <BackFilledSVG fill="black" className="h-5 w-5 cursor-pointer" onClick={() => navigate(-1)} />
        <div className="flex items-center justify-center font-medium">详情</div>
        <div className="flex items-center justify-end">
          <MoreFilledSVG fill="black" className="h-5 w-5" />
        </div>
      </div>
      <Feed id={feedId ?? ''} userId={userId} classNames={feedClassNames} fromDetail />
      <div
        className="flex cursor-pointer space-x-1 bg-wechatBG-3 py-2 pb-2 pl-1 pr-3"
        onClick={() => {
          setRecoil(modeState, ModeState.EDIT);
          setRecoil(feedState(feedId as string), (prev) => ({
            ...prev,
            comments: [...(prev.comments ?? []), generateInitFeedComment()],
          }));
        }}
      >
        <div className="flex h-8 flex-1 items-center rounded bg-white px-3 py-2 text-sm text-gray-400">评论</div>
        <StickerOutlinedSVG fill="#000" className="h-8 w-8" />
      </div>
    </>
  );
};

export default MomentDetail;
