import { AbstractCheckboxGroupProps } from 'antd/es/checkbox/Group';

import { ConversationTypeLabel, EConversationType } from '@/state/conversationState';

export const CONVERSATION_TYPE_OPTIONS: AbstractCheckboxGroupProps['options'] = Object.keys(ConversationTypeLabel)
  .filter((v) => ![EConversationType.redPacketAcceptedReply].includes(v as EConversationType))
  .map((v) => ({
    value: v,
    label: ConversationTypeLabel[v as keyof typeof ConversationTypeLabel],
  }));
