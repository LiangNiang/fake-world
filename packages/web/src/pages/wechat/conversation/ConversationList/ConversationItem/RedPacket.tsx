import { get, isEmpty } from 'lodash-es';
import { memo } from 'react';
import { twJoin } from 'tailwind-merge';

import RedPacketCloseIMG from '@/assets/red-packet-close.png';
import RedPacketOpenIMG from '@/assets/red-packet-open.png';
import { IConversationTypeRedPacket } from '@/state/conversationState';
import { IProfile } from '@/state/profile';

import { RED_PACKET_TEXT_NOTE_MAP } from '../consts';
import CommonBlock from './CommonBlock';

type Props = {
  role: IConversationTypeRedPacket['role'];
  upperText: IConversationTypeRedPacket['upperText'];
  senderId: IProfile['id'];
  redPacketStatus: IConversationTypeRedPacket['redPacketStatus'];
  amount: IConversationTypeRedPacket['amount'];
  note: IConversationTypeRedPacket['note'];
  originalSender: IConversationTypeRedPacket['originalSender'];
};

const IMAGE_MAP: Record<IConversationTypeRedPacket['redPacketStatus'], string> = {
  awaiting: RedPacketCloseIMG,
  accepted: RedPacketOpenIMG,
  expired: RedPacketCloseIMG,
};

const RedPacket = ({ role, upperText, senderId, redPacketStatus, note, originalSender }: Props) => {
  const tips = get(RED_PACKET_TEXT_NOTE_MAP, [originalSender, role, redPacketStatus], '');

  const showTips = !isEmpty(tips);

  return (
    <CommonBlock
      upperText={upperText}
      senderId={senderId}
      blockClassName="w-4/5"
      innerBlockClassName={twJoin(
        'w-full pb-1',
        redPacketStatus === 'awaiting' && 'bg-wechatOrange-3 before:bg-wechatOrange-3',
        (redPacketStatus === 'accepted' || redPacketStatus === 'expired') && 'bg-wechatOrange-5 before:bg-wechatOrange-5'
      )}
    >
      <div className="flex flex-col pl-1 text-white">
        <div className="flex flex-1 items-center border-b border-white/10 pb-1">
          <img src={IMAGE_MAP[redPacketStatus]} className="w-8" />
          <div className="ml-2 flex h-10 flex-col justify-center overflow-hidden">
            <div className="line-clamp-1 font-medium">{isEmpty(note) ? '恭喜发财，大吉大利' : note}</div>
            {showTips && <div className="text-xs font-light">{tips}</div>}
          </div>
        </div>
        <span className="pt-1 text-xs font-light">微信红包</span>
      </div>
    </CommonBlock>
  );
};

export default memo(RedPacket);
