import { memo } from 'react';
import { useRecoilState } from 'recoil';

import RedPacketCloseIMG from '@/assets/red-packet-close.png';
import { conversationState, EConversationRole, IConversationTypeRedPacket, IConversationTypeRedPacketAcceptedReply } from '@/state/conversationState';
import UserName from '@/wechatComponents/User/UserName';

import { useConversationAPI } from '../../context';

type Props = {
  redPacketId: IConversationTypeRedPacketAcceptedReply['redPacketId'];
  upperText: IConversationTypeRedPacketAcceptedReply['upperText'];
  id: IConversationTypeRedPacketAcceptedReply['id'];
};

const RedPacketAcceptedReply = ({ redPacketId, upperText, id }: Props) => {
  const { conversationId } = useConversationAPI();
  const [conversationList, setConversationList] = useRecoilState(conversationState(conversationId));
  const redPacket = conversationList.find((v) => v.id === redPacketId);

  if (!redPacket) {
    console.log(213);
    setConversationList((prev) => prev.filter((v) => v.id !== id));
    return null;
  }

  const { originalSender } = redPacket as IConversationTypeRedPacket;
  const left = originalSender === EConversationRole.friend ? '你' : <UserName id={conversationId} className="text-black/50" />;
  const right = originalSender === EConversationRole.friend ? <UserName id={conversationId} className="text-black/50" /> : '你';

  return (
    <>
      {upperText && <div className={'m-auto text-xs text-black/50'}>{upperText}</div>}
      <div className="m-auto flex items-center text-xs text-black/50">
        <img src={RedPacketCloseIMG} className="w-4" />
        <div className="ml-2">
          {left}
          <span>领取了</span>
          {right}的<span className="text-wechatOrange-3">红包</span>
        </div>
      </div>
    </>
  );
};

export default memo(RedPacketAcceptedReply);
