import { css } from '@emotion/react';
import { memo } from 'react';

import List from '@/wechatComponents/List';

import GroupChatIMG from './assets/group-chat.png';
import NewIMG from './assets/new.png';
import OfficialIMG from './assets/official.png';
import OnlyChatIMG from './assets/only-chat.png';
import TagIMG from './assets/tag.png';

const TopMenus = () => {
  return (
    <List className="relative ml-3 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:origin-top-left after:scale-y-50 after:border-t after:border-black/10">
      <List.Item
        listItemClassName="ml-0"
        textPrev={
          <div
            className="mr-3 h-9 w-9 rounded bg-cover bg-repeat-round"
            css={css`
              background-image: url(${NewIMG});
            `}
          />
        }
      >
        新的朋友
      </List.Item>
      <List.Item
        listItemClassName="ml-0"
        textPrev={
          <div
            className="mr-3 h-9 w-9 rounded bg-cover bg-repeat-round"
            css={css`
              background-image: url(${OnlyChatIMG});
            `}
          />
        }
      >
        仅聊天的朋友
      </List.Item>
      <List.Item
        listItemClassName="ml-0"
        textPrev={
          <div
            className="mr-3 h-9 w-9 rounded bg-cover bg-repeat-round"
            css={css`
              background-image: url(${GroupChatIMG});
            `}
          />
        }
      >
        群聊
      </List.Item>
      <List.Item
        listItemClassName="ml-0"
        textPrev={
          <div
            className="mr-3 h-9 w-9 rounded bg-cover bg-repeat-round"
            css={css`
              background-image: url(${TagIMG});
            `}
          />
        }
      >
        标签
      </List.Item>
      <List.Item
        listItemClassName="ml-0"
        textPrev={
          <div
            className="mr-3 h-9 w-9 rounded bg-cover bg-repeat-round"
            css={css`
              background-image: url(${OfficialIMG});
            `}
          />
        }
      >
        公众号
      </List.Item>
    </List>
  );
};

export default memo(TopMenus);
