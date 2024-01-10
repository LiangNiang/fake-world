import { nanoid } from 'nanoid';

import getFakerInstanceByLang from '@/faker/core';
import { IProfile } from '@/state/profile';

export function randomAvatar() {
  const faker = getFakerInstanceByLang();
  return faker.image.avatarGitHub();
}

export function randomUserId() {
  return nanoid(8);
}

export function randomGender() {
  const faker = getFakerInstanceByLang();
  return faker.person.sexType();
}

export function randomNickname() {
  const faker = getFakerInstanceByLang();
  const gender = randomGender();
  return faker.person.fullName({
    sex: gender,
  });
}

export function generaterFakeUser(preData: Partial<IProfile> = {}): IProfile {
  const faker = getFakerInstanceByLang();
  const gender = randomGender();
  return {
    id: randomUserId(),
    nickname: randomNickname(),
    gender,
    avatarInfo: randomAvatar(),
    wechat: faker.internet.userName({
      firstName: faker.person.firstName(gender),
      lastName: faker.person.lastName(gender),
    }),
    momentsBackgroundLike: false,
    privacy: 'all',
    momentsPrivacy: 'all',
    thumbnailInfo: [],
    momentsBackgroundInfo: faker.image.url(),
    ...preData,
  };
}
