/* eslint-disable no-case-declarations */
import { offset, useClick, useDismiss, useFloating, useInteractions, useTransitionStyles } from '@floating-ui/react';
import dayjs from 'dayjs';
import { isEqual } from 'lodash-es';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { getRecoil, setRecoil } from 'recoil-nexus';
import { twJoin } from 'tailwind-merge';

import CommentOutlinedSVG from '@/assets/comment-outlined.svg?react';
import LikeFilledSVG from '@/assets/like-filled.svg?react';
import LikeOutlinedSVG from '@/assets/like-outlined.svg?react';
import More2OutlinedSVG from '@/assets/more-2-outlined.svg?react';
import PlayFilledSVG from '@/assets/play-filled.svg?react';
import { h } from '@/components/HashAssets';
import { generateInitFeedComment } from '@/faker/wechat/moments';
import { MYSELF_ID } from '@/faker/wechat/user';
import { ModeState, modeState } from '@/state/modeState';
import { feedState, IFeed } from '@/state/moments';
import SlateText from '@/wechatComponents/SlateText';
import { SLATE_EMPTY_VALUE } from '@/wechatComponents/SlateText/utils';

type Props = {
  id: IFeed['id'];
  fromDetail?: boolean;
};

const FeedContent = ({ id, fromDetail }: Props) => {
  const { content, sendTimestamp, likeUserIds } = useRecoilValue(feedState(id));
  const [operationsVisible, setOperationsVisible] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: operationsVisible,
    onOpenChange: (v) => {
      getRecoil(modeState) === ModeState.PREVIEW && setOperationsVisible(v);
    },
    placement: 'left',
    middleware: [offset(8)],
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { isMounted, styles: animationStyles } = useTransitionStyles(context, {
    initial: {
      transform: 'scaleX(0)',
    },
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);
  const { t, i18n } = useTranslation();

  const isLiked = likeUserIds?.includes(MYSELF_ID);
  const isEN = i18n.language === 'en-US';

  const renderFeedPureText = () => {
    const { type } = content;
    switch (type) {
      case 'text':
      case 'textWithImages':
      case 'video':
        if (content.text && !isEqual(content.text, SLATE_EMPTY_VALUE)) {
          return (
            <div className="mt-1">
              <SlateText content={content.text} />
            </div>
          );
        }
        return null;
      default:
        return null;
    }
  };

  const renderFeedImages = () => {
    const { type } = content;
    switch (type) {
      case 'textWithImages':
        const length = content.imagesInfo.length;
        if (length >= 2) {
          return (
            <div className={twJoin('mt-2 grid grid-cols-3 gap-1', fromDetail && 'mr-[25%]')}>
              {content.imagesInfo.map((img, i) => (
                <div key={i} className="aspect-h-1 aspect-w-1">
                  <h.img src={img} className="col-span-1 object-cover object-center" />
                </div>
              ))}
            </div>
          );
        } else if (length === 1) {
          return (
            <div className="mt-2 grid grid-cols-5 gap-1">
              <div className="aspect-h-1 aspect-w-1 col-span-3">
                <h.img src={content.imagesInfo[0]} className="object-cover object-center" />
              </div>
            </div>
          );
        } else {
          return null;
        }
      case 'video':
        if (content.videoInfo) {
          return (
            <div className="mt-2 grid grid-cols-5 gap-1">
              <div className="relative col-span-3">
                <h.img src={content.videoInfo} className="object-cover object-center" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border border-white p-1">
                  <PlayFilledSVG fill="white" width={32} height={32} />
                </div>
              </div>
            </div>
          );
        }
        return null;
      default:
        return null;
    }
  };

  const handleLikeByMyself = () => {
    setOperationsVisible(false);
    setRecoil(feedState(id), (prev) => ({
      ...prev,
      likeUserIds: isLiked ? [...(prev.likeUserIds ?? []).filter((v) => v !== MYSELF_ID)] : [...(prev.likeUserIds ?? []), MYSELF_ID],
    }));
  };

  const handleClickComment = () => {
    setOperationsVisible(false);
    setRecoil(feedState(id), (prev) => ({
      ...prev,
      comments: [...(prev.comments ?? []), generateInitFeedComment()],
    }));
  };

  return (
    <>
      {renderFeedPureText()}
      {renderFeedImages()}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm text-gray-400">{dayjs(sendTimestamp).fromNow()}</span>
        <div ref={refs.setReference} {...getReferenceProps()} className="cursor-pointer select-none rounded bg-wechatBG-3 py-[2px] pl-2">
          <More2OutlinedSVG fill="#465677" className="h-4 w-6 scale-150" />
        </div>
        {isMounted && (
          <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()} className="flex select-none text-white">
            <div className="flex origin-right rounded bg-wechatBG-2" style={animationStyles}>
              <div
                className={twJoin(
                  'relative flex cursor-pointer items-center justify-center rounded rounded-r-none py-1 text-xs after:absolute after:right-0 after:h-3 after:w-[1px] after:bg-black hover:bg-wechatBG-1',
                  isEN && 'w-24',
                  !isEN && 'w-18'
                )}
                onClick={handleLikeByMyself}
              >
                {isLiked ? (
                  <>
                    <LikeFilledSVG fill="#E14949" className="mr-[2px] h-5 w-5" />
                    {t('wechatPage.moments.cancel')}
                  </>
                ) : (
                  <>
                    <LikeOutlinedSVG fill="white" className="mr-[2px] h-5 w-5" />
                    {t('wechatPage.moments.like')}
                  </>
                )}
              </div>
              <div
                className={twJoin(
                  'flex cursor-pointer items-center justify-center rounded rounded-l-none py-1 text-xs hover:bg-wechatBG-1',
                  isEN && 'w-24',
                  !isEN && 'w-18'
                )}
                onClick={handleClickComment}
              >
                <CommentOutlinedSVG fill="white" className="mr-[2px] h-5 w-5" />
                {t('wechatPage.moments.comment')}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default memo(FeedContent);
