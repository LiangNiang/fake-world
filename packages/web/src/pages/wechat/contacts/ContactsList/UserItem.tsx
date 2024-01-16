import { Modal } from 'antd';
import { memo } from 'react';
import { getRecoil, resetRecoil, setRecoil } from 'recoil-nexus';
import { twJoin } from 'tailwind-merge';

import TopOperations from '@/components/TopOperations';
import useModeNavigate from '@/components/useModeNavigate';
import { MYSELF_ID } from '@/faker/wechat/user';
import { MetaDataType } from '@/state/detectedNode';
import { dialogueListState } from '@/state/dialogueState';
import { allFeedsState, feedState } from '@/state/moments';
import { friendsIdsState, friendState } from '@/state/profile';
import List from '@/wechatComponents/List';
import UserAvatar from '@/wechatComponents/User/UserAvatar';

import { TRenderUser } from '../utils';

const UserItem = ({ id, name, description, _isLastInAnchorGroup, _key }: TRenderUser) => {
  const navigate = useModeNavigate();

  const withDescription = !!description;

  const handleOperationDelete = () => {
    Modal.confirm({
      title: '是否删除该好友',
      content: '删除好友会同时删除与该好友的对话、该好友的朋友圈',
      onOk: () => {
        setRecoil(friendsIdsState, (pv) => pv.filter((v) => v !== id));
        resetRecoil(friendState(id));
        setRecoil(dialogueListState, (pv) => pv.filter((v) => v.friendId !== id));
        const allFeeds = getRecoil(allFeedsState);
        allFeeds.filter((v) => v.userId === id).forEach((v) => resetRecoil(feedState(v.id)));
        setRecoil(allFeedsState, (pv) => pv.filter((v) => v.userId !== id));
      },
    });
  };

  return (
    <List.CanBeDetectedItem
      textPrev={<UserAvatar size="small" id={id} className="mr-3" />}
      metaData={
        id === MYSELF_ID
          ? { type: MetaDataType.MyProfile, treeItemDisplayName: '我自己' }
          : {
              type: MetaDataType.FirendProfile,
              index: id,
              treeItemDisplayName: () => `好友（${name}）`,
              operations: [
                {
                  element: <TopOperations.OperaionDeleteBase />,
                  onClick: handleOperationDelete,
                },
              ],
            }
      }
      textPrevClassName="ml-0"
      key={_key}
      onClick={() => navigate(`/wechat/friend/${id}`)}
      className={twJoin('ml-4', _isLastInAnchorGroup && 'border-b border-black/5')}
      rightClassName={twJoin(withDescription && 'py-0 pb-1', _isLastInAnchorGroup && 'border-none')}
    >
      <div className="flex flex-col">
        <span>{name}</span>
        <span className="text-sm text-black/60">{description}</span>
      </div>
    </List.CanBeDetectedItem>
  );
};

export default memo(UserItem);
