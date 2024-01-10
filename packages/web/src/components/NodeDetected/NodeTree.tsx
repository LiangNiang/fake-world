/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Tree } from 'antd';
import { isArray, isFunction, isNil, isString } from 'lodash-es';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { getRecoil } from 'recoil-nexus';

import { activatedNodeState, allNodesTreeState, nodeDataState, nodeInjectMetaState, TreeNode } from '@/state/detectedNode';
import { StaticMetaData } from '@/state/detectedNode/typing';
import { ModeState, modeState } from '@/state/globalConfig';

import { doChangeOrder } from './utils';

const NodeTreeTitle = ({ item }: { item: TreeNode }) => {
  const { t } = useTranslation();
  const node = useRecoilValue(nodeDataState(item.id));
  if (!node) return <></>;

  const { injectMetaData, freshData } = node;
  if (!injectMetaData) return <div>{item.id}</div>;

  const renderTitleFunctional = (treeItemDisplayName: StaticMetaData.InjectMetaData['treeItemDisplayName'], freshDataIndex?: number) => {
    if (isString(treeItemDisplayName)) return <div>{treeItemDisplayName}</div>;
    if (isFunction(treeItemDisplayName) && freshData !== undefined) {
      if (Array.isArray(freshData) && freshDataIndex !== undefined && !isNil(freshData[freshDataIndex])) {
        // @ts-ignore
        return <div>{treeItemDisplayName(freshData[freshDataIndex], t)}</div>;
      } else {
        // @ts-ignore
        return <div>{treeItemDisplayName(freshData, t)}</div>;
      }
    } else {
      return <div>{item.id}</div>;
    }
  };

  if (Array.isArray(injectMetaData)) {
    const hasTreeItemDisplayNameIndex = injectMetaData.findIndex((v) => !!v.treeItemDisplayName);
    if (hasTreeItemDisplayNameIndex === -1) return <div>{item.id}</div>;
    return renderTitleFunctional(injectMetaData[hasTreeItemDisplayNameIndex].treeItemDisplayName, hasTreeItemDisplayNameIndex);
  } else {
    return injectMetaData.treeItemDisplayName ? renderTitleFunctional(injectMetaData.treeItemDisplayName) : <div>{item.id}</div>;
  }
};

const NodeTree = () => {
  const [currentSelected, setCurrentSelected] = useState<string>();
  const activatedNode = useRecoilValue(activatedNodeState);
  const allNodeTree = useRecoilValue(allNodesTreeState);
  useEffect(() => {
    if (activatedNode) {
      setCurrentSelected(activatedNode);
    }
  }, [activatedNode]);

  if (allNodeTree?.length === 0) {
    return <></>;
  }

  return (
    <Tree<TreeNode>
      key={nanoid(2)}
      treeData={allNodeTree}
      defaultExpandAll
      blockNode
      onSelect={(v) => {
        if (v.length === 1) {
          setCurrentSelected(v[0] as string);
          const element = document.getElementById(v[0] as string);
          element?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
          if (getRecoil(modeState) !== ModeState.EDIT) return;
          element?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
      }}
      selectedKeys={[currentSelected as string]}
      titleRender={(item) => <NodeTreeTitle item={item} />}
      draggable={(node) => {
        return (node as TreeNode).nodeTreeSort && getRecoil(modeState) === ModeState.EDIT;
      }}
      onDrop={(info) => {
        const dropKey = info.node.key;
        /** 放置的节点是否是拖拽列表的直接子节点 */
        const isDropIsDirectChild = info.dragNode.parent?.key === info.node.parent?.key;
        const dragKey = info.dragNode.key;
        const dragMetaData = getRecoil(nodeInjectMetaState(dragKey as string));
        const usedDragMetaData = isArray(dragMetaData) ? dragMetaData[0] : dragMetaData;
        doChangeOrder(
          dragKey as string,
          {
            toNodeId: dropKey as string,
            toFirst: !isDropIsDirectChild,
          },
          usedDragMetaData
        );
      }}
      allowDrop={({ dropPosition, dropNode, dragNode }) => {
        if (dropNode.parent?.key !== dragNode.parent?.key && dropNode.key !== dragNode.parent?.key) return false;
        return dropPosition !== 0 || dropNode.children.length > 0;
      }}
    />
  );
};

export default NodeTree;
