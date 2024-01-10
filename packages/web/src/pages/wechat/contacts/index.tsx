import { css } from '@emotion/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { getRecoil } from 'recoil-nexus';

import AddFriendSVG from '@/assets/add-friend-outlined.svg?react';
import SearchOutlinedSVG from '@/assets/search-outlined.svg?react';
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
      isStarred: profile.isStarred,
    };
  });
  const anchorData = useMemo(() => {
    return generateNameAnchorGroup(allFriendsWithName);
  }, [JSON.stringify(allFriendsIds)]);

  return (
    <>
      <div className="grid grid-cols-3 justify-center bg-[rgba(237,237,237,1)] px-4 py-2">
        <div />
        <div className="flex justify-center font-medium">{t('wechatPage.contacts.title')}</div>
        <div className="flex items-center justify-end">
          <AddFriendSVG height={20} width={20} fill="black" className="cursor-pointer" />
        </div>
      </div>
      <div className="flex flex-1 flex-col bg-white">
        <div className="flex bg-[rgba(237,237,237,1)] px-2 pb-3">
          <div className="flex flex-1 items-center justify-center rounded-[4px] bg-white p-2 text-xs">
            <SearchOutlinedSVG fill="rgba(0, 0, 0, 0.5)" width={17} height={16} />
            <span className="ml-2 opacity-50">{t('wechatPage.main.search')}</span>
          </div>
        </div>
        <List>
          <List.Item
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
      </div>
      <Anchor data={anchorData} />
      <BottomNavbar />
    </>
  );
};

export default Contacts;
