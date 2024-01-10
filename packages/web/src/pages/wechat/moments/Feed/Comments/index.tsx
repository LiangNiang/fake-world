import { isEmpty } from 'lodash-es';
import { useMemo } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import { twMerge } from 'tailwind-merge';

import CommentOutlinedSVG from '@/assets/comment-outlined.svg?react';
import { canBeDetected } from '@/components/NodeDetected';
import TopOperations from '@/components/TopOperations';
import useMode from '@/components/useMode';
import { allNodesTreeState, MetaDataType } from '@/state/detectedNode';
import { feedState, IFeed } from '@/state/moments';

import CommentItem from './CommentItem';

type CommentsProps = {
  id: IFeed['id'];
  fromDetail?: boolean;
};

const Comments = ({ id, fromDetail }: CommentsProps) => {
  const { comments, likeUserIds } = useRecoilValue(feedState(id));
  const resetTree = useResetRecoilState(allNodesTreeState);
  const { isEdit } = useMode();

  const mappedSortableListData = useMemo(() => {
    return comments?.map((v) => ({ id: v.id }));
  }, [comments]);

  if (isEmpty(comments)) return null;

  return (
    <>
      {!isEmpty(likeUserIds) && <div className="h-[1px] bg-black/5" />}
      <canBeDetected.div
        className={twMerge('p-[6px]', fromDetail && 'flex p-2')}
        metaData={{
          type: MetaDataType.FeedCommentsList,
          index: id,
          treeItemDisplayName: '评论',
          label: '新建评论',
          operations: [
            {
              onClick: TopOperations.OperationSelectParent.selectParentNode,
              element: <TopOperations.OperationSelectParent />,
            },
          ],
        }}
      >
        {fromDetail && <CommentOutlinedSVG fill="#465677" className="mr-2 mt-2 h-5 w-5 flex-shrink-0 origin-center scale-90" />}
        <ReactSortable
          className="flex flex-1 flex-col space-y-1"
          disabled={!isEdit}
          list={mappedSortableListData}
          animation={400}
          setList={(v, sortable) => {
            if (isEdit && sortable) {
              setRecoil(feedState(id), (prev) => ({
                ...prev,
                comments: v.map((i) => prev.comments!.find((d) => d.id === i.id)!),
              }));
            }
          }}
          onSort={() => {
            setTimeout(() => {
              resetTree();
            });
          }}
        >
          {comments!.map((v) => (
            <CommentItem key={v.id} feedId={id} fromDetail={fromDetail} {...v} />
          ))}
        </ReactSortable>
      </canBeDetected.div>
    </>
  );
};

export default Comments;
