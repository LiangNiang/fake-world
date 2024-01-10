import { css } from '@emotion/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { getRecoil } from 'recoil-nexus';

import { BottomNavBars } from '@/state/btmNavbarsState';
import { friendsIdsState, friendState } from '@/state/profile';
import BottomNavbar, { useToggleNavbarActivated } from '@/wechatComponents/BottomNavbar';
import List from '@/wechatComponents/List';

import Anchor from './anchor';
import GroupChatIMG from './assets/group-chat.png';
import NewIMG from './assets/new.png';
import OfficialIMG from './assets/official.png';
import OnlyChatIMG from './assets/only-chat.png';
import TagIMG from './assets/tag.png';
import { generateNameAnchorGroup } from './utils';

const Contacts = () => {
  const { t } = useTranslation();
  const allFriendsIds = useRecoilValue(friendsIdsState);

  useToggleNavbarActivated(BottomNavBars.ADDRESS_BOOK);

  const allFriendsWithName = allFriendsIds.map((id) => {
    const profile = getRecoil(friendState(id));
    return {
      id,
      name: profile.remark ?? profile.nickname,
    };
  });
  const anchorData = useMemo(() => {
    return generateNameAnchorGroup(allFriendsWithName);
  }, [JSON.stringify(allFriendsIds)]);

  return (
    <>
      <div className="flex justify-center bg-[rgba(237,237,237,1)] py-2 font-medium">{t('wechatPage.contacts.title')}</div>
      <div className="flex flex-1 flex-col bg-[rgba(237,237,237,1)]">
        <List>
          <List.Item
            textPrev={
              <div
                className="mr-4 h-9 w-9 rounded bg-cover bg-repeat-round"
                css={css`
                  background-image: url(${NewIMG});
                `}
              />
            }
          >
            新的朋友
          </List.Item>
          <List.Item
            textPrev={
              <div
                className="mr-4 h-9 w-9 rounded bg-cover bg-repeat-round"
                css={css`
                  background-image: url(${OnlyChatIMG});
                `}
              />
            }
          >
            仅聊天的朋友
          </List.Item>
          <List.Item
            textPrev={
              <div
                className="mr-4 h-9 w-9 rounded bg-cover bg-repeat-round"
                css={css`
                  background-image: url(${GroupChatIMG});
                `}
              />
            }
          >
            群聊
          </List.Item>
          <List.Item
            textPrev={
              <div
                className="mr-4 h-9 w-9 rounded bg-cover bg-repeat-round"
                css={css`
                  background-image: url(${TagIMG});
                `}
              />
            }
          >
            标签
          </List.Item>
          <List.Item
            textPrev={
              <div
                className="mr-4 h-9 w-9 rounded bg-cover bg-repeat-round"
                css={css`
                  background-image: url(${OfficialIMG});
                `}
              />
            }
          >
            公众号
          </List.Item>
        </List>
      </div>
      <Anchor data={anchorData} />
      <BottomNavbar />
    </>
  );
};

export default Contacts;
