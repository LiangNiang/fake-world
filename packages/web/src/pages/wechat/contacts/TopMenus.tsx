import { css } from '@emotion/react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import GroupChatIMG from './assets/group-chat.png';
import NewIMG from './assets/new.png';
import OfficialIMG from './assets/official.png';
import OnlyChatIMG from './assets/only-chat.png';
import TagIMG from './assets/tag.png';
import { UniversalList } from './FriendList/UniversalComponent';

const TopMenus = () => {
  const { t } = useTranslation();

  return (
    <UniversalList>
      <UniversalList.Item
        textPrev={
          <div
            className="mr-3 h-9 w-9 rounded bg-cover bg-repeat-round"
            css={css`
              background-image: url(${NewIMG});
            `}
          />
        }
      >
        {t('wechatPage.contacts.new')}
      </UniversalList.Item>
      <UniversalList.Item
        textPrev={
          <div
            className="mr-3 h-9 w-9 rounded bg-cover bg-repeat-round"
            css={css`
              background-image: url(${OnlyChatIMG});
            `}
          />
        }
      >
        {t('wechatPage.contacts.chatsOnly')}
      </UniversalList.Item>
      <UniversalList.Item
        textPrev={
          <div
            className="mr-3 h-9 w-9 rounded bg-cover bg-repeat-round"
            css={css`
              background-image: url(${GroupChatIMG});
            `}
          />
        }
      >
        {t('wechatPage.contacts.group')}
      </UniversalList.Item>
      <UniversalList.Item
        textPrev={
          <div
            className="mr-3 h-9 w-9 rounded bg-cover bg-repeat-round"
            css={css`
              background-image: url(${TagIMG});
            `}
          />
        }
      >
        {t('wechatPage.contacts.tags')}
      </UniversalList.Item>
      <UniversalList.Item
        textPrev={
          <div
            className="mr-3 h-9 w-9 rounded bg-cover bg-repeat-round"
            css={css`
              background-image: url(${OfficialIMG});
            `}
          />
        }
      >
        {t('wechatPage.contacts.official')}
      </UniversalList.Item>
    </UniversalList>
  );
};

export default memo(TopMenus);
