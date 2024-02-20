/* eslint-disable no-case-declarations */
import { memo } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { h } from '@/components/HashAssets';
import { MYSELF_ID } from '@/faker/wechat/user';
import { conversationItemReferenceState, EConversationRole, EConversationType, IConversationTypeText } from '@/state/conversationState';
import SlateText from '@/wechatComponents/SlateText';
import UserName from '@/wechatComponents/User/UserName';

import CommonBlock from './CommonBlock';

type Props = {
  referenceId: IConversationTypeText['referenceId'];
};

const TextReference = ({ referenceId }: Props) => {
  const { id } = useParams<{ id: string }>();
  const referenceData = useRecoilValue(conversationItemReferenceState({ profileId: id!, conversationId: referenceId! }));
  console.log(referenceData);

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
    <CommonBlock
      hideAvatar
      upperText={undefined}
      senderId={senderId}
      innerBlockClassName="bg-[#E7E7E7] text-[#7D7D7D] h-fit p-0 text-sm cursor-pointer"
      blockClassName="!mt-1"
    >
      <div className="m-2 line-clamp-2">
        <div className="float-start inline">
          <UserName id={senderId} className="inline text-[#7D7D7D]" />
          <span className="mr-2">:</span>
        </div>
        {renderBlockElement()}
      </div>
    </CommonBlock>
  );
};

export default memo(TextReference);
