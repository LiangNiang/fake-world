import { memo } from 'react';

import { IConversationTypeText } from '@/state/conversationState';
import { IProfile } from '@/state/profile';
import SlateText from '@/wechatComponents/SlateText';

import CommonBlock from './CommonBlock';

type Props = {
  upperText: IConversationTypeText['upperText'];
  senderId: IProfile['id'];
  textContent: IConversationTypeText['textContent'];
};

const Text = ({ upperText, senderId, textContent }: Props) => {
  return (
    <CommonBlock
      upperText={upperText}
      senderId={senderId}
      innerBlockClassName="group-[.friend]:bg-white group-[.mine]:bg-[#8CE97F] group-[.friend]:before:bg-white group-[.mine]:before:bg-[#8CE97F]"
    >
      <SlateText content={textContent} />
    </CommonBlock>
  );
};

export default memo(Text);
