/* eslint-disable no-case-declarations */
import { AimOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { memo } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { getRecoil } from 'recoil-nexus';

import { h } from '@/components/HashAssets';
import { canBeDetected, InjectProps } from '@/components/NodeDetected';
import TopOperations from '@/components/TopOperations';
import { MYSELF_ID } from '@/faker/wechat/user';
import {
  conversationItemReferenceState,
  conversationState,
  EConversationRole,
  EConversationType,
  IConversationTypeText,
} from '@/state/conversationState';
import { activatedNodeState, MetaDataType } from '@/state/detectedNode';
import { ModeState, modeState } from '@/state/modeState';
import SlateText from '@/wechatComponents/SlateText';
import UserName from '@/wechatComponents/User/UserName';

import CommonBlock from './CommonBlock';

type Props = {
  referenceId: IConversationTypeText['referenceId'];
  conversationItemId: IConversationTypeText['id'];
};

const TextReference = ({ referenceId, conversationItemId }: Props) => {
  const { id } = useParams<{ id: string }>();
  const referenceData = useRecoilValue(conversationItemReferenceState({ profileId: id!, conversationId: referenceId! }));
  const setConversationList = useSetRecoilState(conversationState(id!));
  const setActivatedNode = useSetRecoilState(activatedNodeState);

  if (!referenceData) return null;

  const { role, type } = referenceData;
  const senderId = role === EConversationRole.friend ? id! : MYSELF_ID;

  const renderBlockElement = () => {
    switch (type) {
      case EConversationType.text:
        const { textContent } = referenceData;
        return (
          <SlateText
            content={textContent}
            classNames={{
              base: 'inline',
              emojiClassName: 'h-5 w-5 text-sm origin-top-left scale-85 mx-[1px]',
              emojiInnerClassName: 'mx-0',
              textClassName: 'inline',
            }}
          />
        );
      case EConversationType.image:
        const { imageInfo } = referenceData;
        return <h.img src={imageInfo} className="h-9 w-9 rounded object-cover object-center" />;
      default:
        return <span>[该消息类型暂不能显示]</span>;
    }
  };

  return (
    <CommonBlock<InjectProps>
      hideAvatar
      upperText={undefined}
      senderId={senderId}
      innerBlockComponent={canBeDetected.div}
      innerBlockProps={{
        metaData: [
          {
            type: MetaDataType.ConversationItem,
            index: [id!, referenceId!],
            treeItemDisplayName: '引用消息',
            label: '编辑引用消息',
            operations: [
              {
                element: (
                  <TopOperations.OperaionDeleteBase
                    tooltipProps={{
                      title: '移除引用消息（不删除原始的被引用消息）',
                    }}
                  />
                ),
                onClick: () => {
                  setConversationList((prev) => prev.map((v) => (v.id === conversationItemId ? { ...v, referenceId: undefined } : v)));
                },
              },
              {
                element: (
                  <Tooltip title="定位到原始消息">
                    <AimOutlined />
                  </Tooltip>
                ),
                onClick: () => {
                  const target = document.querySelector(`[data-conversation-id="${referenceId}"]`);
                  const id = target?.getAttribute('id');
                  if (id) {
                    target!.scrollIntoView({ behavior: 'smooth' });
                    setActivatedNode(id);
                  }
                },
              },
            ],
          },
          {
            type: MetaDataType.FirendProfile,
            index: id!,
            label: '好友个人信息',
          },
          {
            type: MetaDataType.MyProfile,
            label: '个人信息',
          },
        ],
      }}
      innerBlockClassName="bg-[#E7E7E7] text-[#7D7D7D] h-fit p-0 text-sm cursor-pointer"
      blockClassName="!mt-1"
      onClick={() => {
        if (getRecoil(modeState) === ModeState.EDIT) return;
        const target = document.querySelector(`[data-conversation-id="${referenceId}"]`);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }}
    >
      <div className="m-2 line-clamp-2">
        <div className="float-left inline">
          <UserName id={senderId} className="inline text-[#7D7D7D]" />
          <span className="mr-2">:</span>
        </div>
        {renderBlockElement()}
      </div>
    </CommonBlock>
  );
};

export default memo(TextReference);
