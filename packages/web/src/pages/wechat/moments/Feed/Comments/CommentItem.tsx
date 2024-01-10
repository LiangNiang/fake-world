import { Modal } from 'antd';
import dayjs from 'dayjs';
import { memo } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { setRecoil } from 'recoil-nexus';

import { canBeDetected } from '@/components/NodeDetected';
import TopOperations from '@/components/TopOperations';
import useModeNavigate from '@/components/useModeNavigate';
import { activatedNodeState, getActivatedNodeParent, MetaDataType } from '@/state/detectedNode';
import { StaticMetaData } from '@/state/detectedNode/typing';
import { feedState, IFeed, IFeedComment } from '@/state/moments';
import { friendState, IProfile } from '@/state/profile';
import SlateText from '@/wechatComponents/SlateText';
import UserAvatar from '@/wechatComponents/User/UserAvatar';
import UserName from '@/wechatComponents/User/UserName';

const CommentUserText = ({ fromUserId, replyUserId }: Pick<IFeedComment, 'fromUserId' | 'replyUserId'>) => {
  const { nickname: fromNickname, remark: fromRemark } = useRecoilValue(friendState(fromUserId));
  const { nickname: replyNickname, remark: replyRemark } = useRecoilValue(friendState(replyUserId || ''));
  const navigate = useModeNavigate({ silence: true });

  const renderReplyText = () => {
    if (replyUserId) {
      return (
        <div className="inline">
          <span className="mx-[2px]">回复</span>
          <span className="cursor-pointer text-wechatLink-1" onClick={() => navigate(`/wechat/friend/${replyUserId}`)}>
            {replyRemark ?? replyNickname}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative z-10 float-left inline">
      <span className="cursor-pointer text-wechatLink-1" onClick={() => navigate(`/wechat/friend/${fromUserId}`)}>
        {fromRemark ?? fromNickname}
      </span>
      {renderReplyText()}
      <span className="ml-[2px] mr-1">:</span>
    </div>
  );
};

const CommentItem = ({
  fromUserId,
  replyUserId,
  text,
  feedId,
  id,
  fromDetail,
  sendTimestamp,
}: IFeedComment & { feedId: IFeed['id']; fromDetail?: boolean }) => {
  const setFeed = useSetRecoilState(feedState(feedId));
  const navigate = useModeNavigate({ silence: true });

  const handleCommentItemDelete = () => {
    Modal.confirm({
      title: '是否删除该条评论',
      onOk: () => {
        setFeed((prev) => ({
          ...prev,
          comments: prev.comments?.filter((v) => v.id !== id),
        }));
      },
    });
  };

  const handleNew = () => {
    const parent = getActivatedNodeParent();
    if (parent) {
      setRecoil(activatedNodeState, parent.id);
    }
  };

  const metaData: StaticMetaData.InjectMetaData[] = [
    {
      type: MetaDataType.FeedCommentsItem,
      index: [feedId, id],
      label: '评论',
      operations: [
        {
          onClick: handleCommentItemDelete,
          element: <TopOperations.OperaionDeleteBase tooltipProps={{ title: '删除该评论' }} />,
        },
        {
          onClick: handleNew,
          element: <TopOperations.OperationNewBase tooltipProps={{ title: '新增评论' }} />,
        },
      ],
    },
    {
      type: MetaDataType.FirendProfile,
      index: fromUserId,
      label: '评论发送者',
      treeItemDisplayName: (data) => `${data.nickname}发出的评论`,
    },
  ];
  if (replyUserId) {
    metaData.push({
      type: MetaDataType.FirendProfile,
      index: replyUserId,
      label: '评论回复的人',
    });
  }

  const toUser = (id: IProfile['id']) => {
    navigate(`/wechat/friend/${id}`);
  };

  if (fromDetail) {
    return (
      <canBeDetected.div className="relative flex border-b border-black/5 pb-2 last:border-none last:pb-0" metaData={metaData}>
        <UserAvatar id={fromUserId} onClick={() => toUser(fromUserId)} size="small" className="cursor-pointer" />
        <div className="ml-[6px] flex flex-1 flex-col text-sm">
          <div className="flex items-center justify-between">
            <UserName id={fromUserId} onClick={() => toUser(fromUserId)} className="cursor-pointer self-start" />
            <div className="text-xs text-black/60">{dayjs(sendTimestamp).fromNow()}</div>
          </div>
          <div className="block text-sm">
            {replyUserId && (
              <div className="relative z-10 float-left inline">
                回复
                <UserName id={replyUserId} onClick={() => toUser(replyUserId)} className="cursor-pointer" />
                <span className="ml-[2px] mr-1">:</span>
              </div>
            )}
            <SlateText content={text} classNames={{ base: 'inline', emojiClassName: 'h-5 w-5 text-sm origin-top-left scale-85' }} />
          </div>
        </div>
      </canBeDetected.div>
    );
  } else {
    return (
      <canBeDetected.div className="block text-sm" metaData={metaData}>
        <CommentUserText fromUserId={fromUserId} replyUserId={replyUserId} />
        <SlateText content={text} classNames={{ base: 'inline', emojiClassName: 'h-5 w-5 text-sm origin-top-left scale-85' }} />
      </canBeDetected.div>
    );
  }
};

export default memo(CommentItem);
