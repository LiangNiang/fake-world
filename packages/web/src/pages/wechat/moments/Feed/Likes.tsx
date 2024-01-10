import { EditOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { isEmpty } from 'lodash-es';
import { memo } from 'react';
import { useRecoilValue } from 'recoil';
import { twJoin, twMerge } from 'tailwind-merge';

import LikeOutlinedSVG from '@/assets/like-outlined.svg?react';
import { h } from '@/components/HashAssets';
import { canBeDetected } from '@/components/NodeDetected';
import TopOperations from '@/components/TopOperations';
import useModeNavigate from '@/components/useModeNavigate';
import { MYSELF_ID } from '@/faker/wechat/user';
import { MetaDataType } from '@/state/detectedNode';
import { feedState, IFeed } from '@/state/moments';
import { friendState, IProfile } from '@/state/profile';

type LikeItemProps = {
  userId: IProfile['id'];
  displayType: 'avatar' | 'name';
};

const LikeItem = ({ userId, displayType }: LikeItemProps) => {
  const { nickname, remark, avatarInfo } = useRecoilValue(friendState(userId));
  const navigate = useModeNavigate({ silence: true });

  const showName = displayType === 'name';
  const showAvatar = displayType === 'avatar';
  const operations = [
    {
      onClick: TopOperations.OperationSelectParent.selectParentNode,
      element: (
        <Tooltip title="编辑点赞列表">
          <EditOutlined />
        </Tooltip>
      ),
    },
  ];

  return (
    <canBeDetected.div
      metaData={
        userId === MYSELF_ID
          ? {
              type: MetaDataType.MyProfile,
              treeItemDisplayName: (data) => `点赞（${data.nickname}）`,
              operations,
            }
          : {
              type: MetaDataType.FirendProfile,
              index: userId,
              treeItemDisplayName: (data) => `点赞（${data.nickname}）`,
              operations,
            }
      }
      className={twJoin(
        'cursor-pointer',
        showName && `text-sm text-wechatLink-1 after:ml-[2px] after:mr-2 after:text-black after:content-[','] last:after:hidden`
      )}
      onClick={() => navigate(`/wechat/friend/${userId}`)}
    >
      {showName && <>{remark ?? nickname}</>}
      {showAvatar && <h.img src={avatarInfo} className="h-9 w-9 rounded object-cover object-center" />}
    </canBeDetected.div>
  );
};

type LikeListProps = {
  id: IFeed['id'];
  fromDetail?: boolean;
};

const LikeList = ({ id, fromDetail }: LikeListProps) => {
  const { likeUserIds } = useRecoilValue(feedState(id));
  if (isEmpty(likeUserIds)) return null;
  return (
    <canBeDetected.div
      className={twMerge('flex p-1', fromDetail && 'p-2')}
      metaData={{
        type: MetaDataType.FeedLikes,
        index: id,
        treeItemDisplayName: (data) => `${data.length}人点赞`,
        operations: [
          {
            onClick: TopOperations.OperationSelectParent.selectParentNode,
            element: <TopOperations.OperationSelectParent />,
          },
        ],
      }}
    >
      <LikeOutlinedSVG fill="#465677" className={twMerge('mr-1 h-5 w-5 flex-shrink-0', fromDetail && 'mr-2 mt-2')} />
      <div className={twJoin('flex flex-wrap', fromDetail && 'gap-1')}>
        {likeUserIds!.map((v) => (
          <LikeItem key={v} userId={v} displayType={fromDetail ? 'avatar' : 'name'} />
        ))}
      </div>
    </canBeDetected.div>
  );
};

export default memo(LikeList);
