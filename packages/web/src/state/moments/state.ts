import { groupBy } from 'lodash-es';
import { atom, atomFamily, DefaultValue, selector, selectorFamily } from 'recoil';

import { DEFAULT_FEED, INIT_FEEDS } from '@/faker/wechat/moments';

import { persistAtom } from '../effects';
import { IProfile } from '../profile';
import { IFeed, IFeedBase } from './typing';

const injectDefaultFeed = (id: IFeed['id']): IFeed => INIT_FEEDS.find((v) => v.id === id) ?? { id, ...DEFAULT_FEED };

export const allFeedsState = atom<IFeedBase[]>({
  key: 'allFeedsState',
  default: INIT_FEEDS.map((v) => ({ id: v.id, userId: v.userId, sendTimestamp: v.sendTimestamp })),
  effects_UNSTABLE: [persistAtom],
});

const __groupUserFeedState = selector<{ [key: IProfile['id']]: IFeedBase[] }>({
  key: '__groupUserFeedState',
  get: ({ get }) => groupBy(get(allFeedsState), 'userId'),
});

export const userFeedsState = selectorFamily<IFeedBase[], IProfile['id']>({
  key: 'userFeedsState',
  get:
    (id) =>
    ({ get }) =>
      get(__groupUserFeedState)[id] ?? [],
});

export const __feedState = atomFamily<IFeed, IFeed['id']>({
  key: '__feedState',
  default: (param) => injectDefaultFeed(param),
  effects_UNSTABLE: () => [persistAtom],
});

export const feedState = selectorFamily<IFeed, IFeed['id']>({
  key: 'feedState',
  get:
    (id) =>
    ({ get }) =>
      get(__feedState(id)),
  set:
    (id) =>
    ({ set, reset, get }, feed) => {
      const { userId: oldUserId, sendTimestamp: oldSendTimestamp } = get(allFeedsState).find((v) => v.id === id) ?? {};
      if (feed instanceof DefaultValue) {
        reset(__feedState(id));
        if (oldUserId !== DEFAULT_FEED.userId) {
          set(allFeedsState, (prev) =>
            prev.map((v) => (v.id === id ? { id, userId: DEFAULT_FEED.userId, sendTimestamp: DEFAULT_FEED.sendTimestamp } : v))
          );
        }
      } else {
        const { userId, sendTimestamp } = feed;
        set(__feedState(id), (prev) => ({ ...prev, ...feed }));
        if (oldUserId !== userId || oldSendTimestamp !== sendTimestamp) {
          set(allFeedsState, (prev) => prev.map((v) => (v.id === id ? { id, userId, sendTimestamp: sendTimestamp } : v)));
        }
      }
    },
});
