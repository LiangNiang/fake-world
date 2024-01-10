import { TFunction } from 'i18next';
import { atom, atomFamily, DefaultValue, selectorFamily } from 'recoil';

import { generaterFakeUser, INIT_FRIENDS, INIT_MY_PROFILE, MYSELF_ID } from '@/faker/wechat/user';

import { persistAtom } from '../effects';
import { IProfile } from './typing';

export const PRIVACY_TEXT_MAP: Record<IProfile['privacy'], string | ((gender: NonNullable<IProfile['gender']>, t: TFunction) => string)> = {
  all: '',
  chatsOnly: 'wechatPage.friend.privacyChatsOnly',
  hideMyPosts: (gender, t) =>
    t('wechatPage.friend.privacyHideMy', {
      title: gender === 'female' ? t('base.she') : t('base.he'),
    }),
  hideFriendPosts: (gender, t) =>
    t('wechatPage.friend.privacyHideFriend', {
      title: gender === 'female' ? t('base.her') : t('base.his'),
    }),
};

export const MOMENTS_PRIVACY_TEXT_MAP: Record<IProfile['momentsPrivacy'], string> = {
  all: '全部',
  lastSixMonths: '最近半年',
  lastOneMonth: '最近一个月',
  lastThreeDays: '最近三天',
};

const injectDefaultFriendsProfile = (id: IProfile['id']): IProfile => INIT_FRIENDS.find((v) => v.id === id) ?? generaterFakeUser({ id });

export const myProfileState = atom<IProfile>({
  key: 'myProfileState',
  default: INIT_MY_PROFILE,
  effects_UNSTABLE: [persistAtom],
});

export const friendsIdsState = atom<IProfile['id'][]>({
  key: 'friendsIdState',
  default: INIT_FRIENDS.map((v) => v.id),
  effects_UNSTABLE: [persistAtom],
});

const __friendProfileAtom = atomFamily<IProfile, IProfile['id']>({
  key: 'friendProfileState',
  default: (param) => injectDefaultFriendsProfile(param),
  effects_UNSTABLE: () => [persistAtom],
});

export const friendState = selectorFamily<IProfile, IProfile['id']>({
  key: 'friendState',
  get:
    (id) =>
    ({ get }) =>
      id === MYSELF_ID ? get(myProfileState) : get(__friendProfileAtom(id)),
  set:
    (id) =>
    ({ set, reset, get }, profile) => {
      if (profile instanceof DefaultValue) {
        id === MYSELF_ID ? reset(myProfileState) : reset(__friendProfileAtom(id));
        return;
      }
      if (id === MYSELF_ID) {
        set(myProfileState, (prev) => ({ ...prev, ...profile }));
      } else {
        set(__friendProfileAtom(id), (prev) => ({ ...prev, ...profile }));
        const ids = get(friendsIdsState);
        if (!ids.includes(id)) {
          set(friendsIdsState, (prev) => [...prev, id]);
        }
      }
    },
});
