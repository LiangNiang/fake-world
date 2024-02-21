import { useMemo } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { useRecoilState, useResetRecoilState } from 'recoil';

import { canBeDetected } from '@/components/NodeDetected';
import useMode from '@/components/useMode';
import { allNodesTreeState, MetaDataType } from '@/state/detectedNode';
import { dialogueListState } from '@/state/dialogueState';

import DialogueItem from './DialogueItem';

const DialogueList = () => {
  const { isEdit } = useMode();
  const [dialogueList, setDialogueList] = useRecoilState(dialogueListState);
  const resetTree = useResetRecoilState(allNodesTreeState);

  const mappedSortableListData = useMemo(() => {
    return dialogueList.map((item) => ({
      id: item.id,
    }));
  }, [dialogueList]);

  return (
    <canBeDetected.section
      metaData={{
        type: MetaDataType.DialogueList,
        treeItemDisplayName: '对话列表',
        label: '从好友列表快速新建对话项',
      }}
      className="flex-1"
    >
      <ReactSortable
        disabled={!isEdit}
        list={mappedSortableListData}
        animation={400}
        setList={(v, sortable) => {
          if (isEdit && sortable) {
            setDialogueList(
              v.map((i) => {
                return dialogueList.find((d) => d.id === i.id)!;
              })
            );
          }
        }}
        onSort={() => {
          setTimeout(() => {
            resetTree();
          });
        }}
      >
        {dialogueList.map((item) => (
          <DialogueItem data={item} key={item.id} className={isEdit ? 'cursor-grab' : ''} />
        ))}
      </ReactSortable>
    </canBeDetected.section>
  );
};

export default DialogueList;
