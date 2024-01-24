import { isEmpty } from 'lodash-es';
import { getRecoil, setRecoil } from 'recoil-nexus';

import { generateInitFeedComment } from '@/faker/wechat/moments';
import { feedState, IFeed } from '@/state/moments';

export function selectFeedCommentsListNode(id: IFeed['id']) {
  const { comments } = getRecoil(feedState(id));
  if (isEmpty(comments)) {
    setRecoil(feedState(id), (prev) => ({
      ...prev,
      comments: [generateInitFeedComment()],
    }));
  }
}
