import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

import getFakerInstanceByLang from '@/faker/core';
import { IFeed } from '@/state/moments';
import { IProfile } from '@/state/profile';

export function randomFeedId() {
  return nanoid(8);
}

export function randomFeedCommentId() {
  return nanoid(8);
}

export function randomFeedImage(num = 1) {
  const faker = getFakerInstanceByLang();
  return Array.from({ length: num }).map(() => faker.image.url());
}

export function generateFakeFeed(userId: IProfile['id']): IFeed {
  return {
    id: randomFeedId(),
    sendTimestamp: dayjs().valueOf(),
    content: {
      type: 'textWithImages',
      imagesInfo: randomFeedImage(3),
    },
    userId,
  };
}
