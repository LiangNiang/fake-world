import { isArray, isEmpty, keys } from 'lodash-es';
import { getRecoil, setRecoil } from 'recoil-nexus';

import { generateInitFeedComment } from '@/faker/wechat/moments';
import { activatedNodeState, allNodesState, MetaDataType, nodeInjectMetaState } from '@/state/detectedNode';
import { feedState, IFeed } from '@/state/moments';

export function selectFeedCommentsListNode(id: IFeed['id']) {
  const { comments } = getRecoil(feedState(id));
  if (isEmpty(comments)) {
    setRecoil(feedState(id), (prev) => ({
      ...prev,
      comments: [generateInitFeedComment()],
    }));
  }
  setTimeout(() => {
    const allNodes = getRecoil(allNodesState);
    const targetNode = keys(allNodes).find((v) => {
      const metaData = getRecoil(nodeInjectMetaState(v));
      if (!isArray(metaData) && metaData?.type === MetaDataType.FeedCommentsList) {
        return metaData.index === id;
      }
      return false;
    });
    setRecoil(activatedNodeState, targetNode!);
  });
}
