import { memo } from 'react';

import { h } from '@/components/HashAssets';
import { IConversationTypePersonalCard } from '@/state/conversationState';
import { IProfile } from '@/state/profile';

import CommonBlock from './CommonBlock';

type Props = {
  upperText: IConversationTypePersonalCard['upperText'];
  avatarInfo: IConversationTypePersonalCard['avatarInfo'];
  nickname: IConversationTypePersonalCard['nickname'];
  senderId: IProfile['id'];
};

const PersonalCard = ({ upperText, senderId, avatarInfo, nickname }: Props) => {
  return (
    <CommonBlock upperText={upperText} senderId={senderId} blockClassName="w-4/5" innerBlockClassName="w-full pb-1 bg-white before:bg-white">
      <div className="flex flex-col pl-1">
        <div className="flex flex-1 items-center border-b border-black/5 pb-2">
          <h.img src={avatarInfo} className="h-10 w-10 min-w-10 rounded object-cover object-center" />
          <div className="ml-2">{nickname}</div>
        </div>
        <span className="pt-1 text-xs text-black/40">个人名片</span>
      </div>
    </CommonBlock>
  );
};

export default memo(PersonalCard);
